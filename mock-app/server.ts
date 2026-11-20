/**
 * Local demo trading UI + API for this portfolio repository only.
 * Not connected to any real broker or employer system.
 */

import express from 'express';
import * as path from 'path';
import { demoOrderEngine } from './orderEngine';
import { env as runtimeEnv } from './runtimeEnv';

const VALID_USER = 'qa.trader@example.com';
const VALID_PASS = 'QaTradePass123!';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  const token = req.header('x-demo-auth');
  if (token === 'demo-session') {
    next();
    return;
  }
  res.status(401).json({ error: 'Unauthorized' });
}

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (username === VALID_USER && password === VALID_PASS) {
    res.status(200).json({ token: 'demo-session', username });
    return;
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/v1/account/summary', requireAuth, (_req, res) => {
  const summary = demoOrderEngine.getAccountSummary();
  res.json({
    accountValue: summary.accountValue,
    buyingPower: summary.buyingPower,
    plDay: summary.plDay,
  });
});

app.get('/v1/positions', requireAuth, (_req, res) => {
  res.json({ positions: demoOrderEngine.getPositions() });
});

app.get('/v1/watchlist', requireAuth, (_req, res) => {
  res.json({ symbols: ['SPCX', 'AAPL', 'SPY', 'TSLA'] });
});

app.get('/v1/orders', requireAuth, (req, res) => {
  const status = req.query.status as string | undefined;
  const orders = demoOrderEngine.getOrders(
    status as 'pending' | 'filled' | 'cancelled' | undefined,
  );
  res.json({ orders });
});

app.post('/v1/orders', requireAuth, (req, res) => {
  try {
    const { symbol, side, quantity, orderType } = req.body as {
      symbol: string;
      side: 'buy' | 'sell';
      quantity: number;
      orderType: string;
    };
    const order = demoOrderEngine.placeOrder({ symbol, side, quantity, orderType });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Bad request' });
  }
});

app.put('/v1/orders/:id', requireAuth, (req, res) => {
  const { status } = req.body as { status?: string };
  const id = String(req.params.id);
  if (status === 'canceled' || status === 'cancelled') {
    const result = demoOrderEngine.cancelOrder(id);
    res.status(result.accepted ? 200 : 409).json(result);
    return;
  }
  if (status === 'filled') {
    const result = demoOrderEngine.fillOrder(id);
    res.status(result.accepted ? 200 : 409).json(result);
    return;
  }
  res.status(400).json({ error: 'Unknown status' });
});

app.delete('/v1/orders/:id', requireAuth, (req, res) => {
  const result = demoOrderEngine.cancelOrder(String(req.params.id));
  res.status(result.accepted ? 204 : 409).send();
});

/** Test-only: reset in-memory state between runs */
app.post('/v1/test/reset', (_req, res) => {
  demoOrderEngine.reset();
  res.status(204).send();
});

/** Test-only: trigger cancel vs fill race */
app.post('/v1/test/orders/:id/race-cancel-fill', async (req, res) => {
  const outcome = await demoOrderEngine.raceCancelVsFill(String(req.params.id));
  res.json(outcome);
});

app.get('/login', (_req, res) => {
  res.sendFile(path.join(publicDir, 'login.html'));
});

app.get('/dashboard', (_req, res) => {
  res.sendFile(path.join(publicDir, 'dashboard.html'));
});

app.get('/trade', (_req, res) => {
  res.sendFile(path.join(publicDir, 'trade.html'));
});

app.get('/orders', (_req, res) => {
  res.sendFile(path.join(publicDir, 'orders.html'));
});

app.get('/positions', (_req, res) => {
  res.sendFile(path.join(publicDir, 'positions.html'));
});

export function startMockServer(): Promise<{ port: number; stop: () => Promise<void> }> {
  return new Promise((resolve) => {
    const server = app.listen(runtimeEnv.mockPort, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : runtimeEnv.mockPort;
      resolve({
        port,
        stop: () =>
          new Promise((done) => {
            server.close(() => done());
          }),
      });
    });
  });
}

if (require.main === module) {
  startMockServer().then(({ port }) => {
    // eslint-disable-next-line no-console
    console.log(`Mock trading demo listening on http://127.0.0.1:${port}`);
  });
}