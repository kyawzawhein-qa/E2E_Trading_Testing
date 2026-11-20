/**
 * In-memory order state machine for the portfolio mock target only.
 * Demonstrates race-safe cancel vs fill: exactly one terminal outcome per order.
 */

export type OrderStatus = 'pending' | 'filled' | 'cancelled';

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  orderType: string;
  status: OrderStatus;
  reservedAmount: number;
}

export interface AccountState {
  accountValue: number;
  buyingPower: number;
  plDay: number;
}

export interface Position {
  symbol: string;
  qty: number;
  avgCost: number;
}

export interface RaceAttemptResult {
  orderId: string;
  finalStatus: OrderStatus;
  cancelAccepted: boolean;
  fillAccepted: boolean;
  /** True when both cancel and fill handlers reported success — must never happen. */
  dualSuccess: boolean;
  positionQty: number;
  buyingPower: number;
}

const FILL_PRICE = 42.5;

export class OrderEngine {
  private orders = new Map<string, Order>();
  private positions = new Map<string, Position>();
  private account: AccountState = {
    accountValue: 100_000,
    buyingPower: 75_000,
    plDay: 125.5,
  };
  private orderSeq = 0;
  private transitionLocks = new Map<string, Promise<void>>();

  reset(): void {
    this.orders.clear();
    this.positions.clear();
    this.transitionLocks.clear();
    this.orderSeq = 0;
    this.account = { accountValue: 100_000, buyingPower: 75_000, plDay: 125.5 };
  }

  getAccountSummary(): AccountState {
    return { ...this.account };
  }

  getPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  getOrders(status?: OrderStatus): Order[] {
    const all = Array.from(this.orders.values());
    return status ? all.filter((o) => o.status === status) : all;
  }

  getOrder(id: string): Order | undefined {
    return this.orders.get(id);
  }

  /**
   * Create a pending order and reserve notional from buying power.
   */
  placeOrder(input: {
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    orderType: string;
  }): Order {
    const notional = input.quantity * FILL_PRICE;
    if (input.side === 'buy' && this.account.buyingPower < notional) {
      throw new Error('Insufficient buying power');
    }

    this.orderSeq += 1;
    const id = `ord-${this.orderSeq}`;
    const order: Order = {
      id,
      symbol: input.symbol.toUpperCase(),
      side: input.side,
      quantity: input.quantity,
      orderType: input.orderType,
      status: 'pending',
      reservedAmount: notional,
    };

    if (input.side === 'buy') {
      this.account.buyingPower -= notional;
    }

    this.orders.set(id, order);
    return { ...order };
  }

  private async withTransitionLock<T>(orderId: string, fn: () => T | Promise<T>): Promise<T> {
    const previous = this.transitionLocks.get(orderId) ?? Promise.resolve();
    let release!: () => void;
    const current = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.transitionLocks.set(orderId, previous.then(() => current));
    await previous;
    try {
      return await fn();
    } finally {
      release();
    }
  }

  cancelOrder(orderId: string): { accepted: boolean; order?: Order } {
    const order = this.orders.get(orderId);
    if (!order || order.status !== 'pending') {
      return { accepted: false, order: order ? { ...order } : undefined };
    }

    order.status = 'cancelled';
    if (order.side === 'buy') {
      this.account.buyingPower += order.reservedAmount;
    }
    return { accepted: true, order: { ...order } };
  }

  fillOrder(orderId: string): { accepted: boolean; order?: Order } {
    const order = this.orders.get(orderId);
    if (!order || order.status !== 'pending') {
      return { accepted: false, order: order ? { ...order } : undefined };
    }

    order.status = 'filled';
    const existing = this.positions.get(order.symbol);
    if (order.side === 'buy') {
      if (existing) {
        const totalQty = existing.qty + order.quantity;
        const totalCost = existing.avgCost * existing.qty + FILL_PRICE * order.quantity;
        existing.qty = totalQty;
        existing.avgCost = totalCost / totalQty;
      } else {
        this.positions.set(order.symbol, {
          symbol: order.symbol,
          qty: order.quantity,
          avgCost: FILL_PRICE,
        });
      }
    }
    return { accepted: true, order: { ...order } };
  }

  /**
   * Simulates cancel and fill arriving in the same tick (QA concurrency demo).
   * Uses a transition lock so only one terminal state is committed.
   */
  async raceCancelVsFill(orderId: string): Promise<RaceAttemptResult> {
    let cancelAccepted = false;
    let fillAccepted = false;

    await Promise.all([
      this.withTransitionLock(orderId, async () => {
        const result = this.cancelOrder(orderId);
        cancelAccepted = result.accepted;
      }),
      this.withTransitionLock(orderId, async () => {
        const result = this.fillOrder(orderId);
        fillAccepted = result.accepted;
      }),
    ]);

    const order = this.orders.get(orderId)!;
    const position = this.positions.get(order.symbol);

    return {
      orderId,
      finalStatus: order.status,
      cancelAccepted,
      fillAccepted,
      dualSuccess: cancelAccepted && fillAccepted,
      positionQty: position?.qty ?? 0,
      buyingPower: this.account.buyingPower,
    };
  }

  /**
   * Invalid fintech outcome: terminal fill plus buying-power refunded as if cancel won.
   * Detects when reserved notional was returned but shares were still credited.
   */
  hasSharesAndRefund(orderId: string, buyingPowerBeforeOrder: number): boolean {
    const order = this.orders.get(orderId);
    if (!order || order.status !== 'filled') {
      return false;
    }
    const position = this.positions.get(order.symbol);
    const hasShares = !!position && position.qty >= order.quantity;
    const refunded = this.account.buyingPower > buyingPowerBeforeOrder - order.reservedAmount + 1;
    return hasShares && refunded;
  }
}

/** Singleton used by the mock HTTP server (demo target only). */
export const demoOrderEngine = new OrderEngine();