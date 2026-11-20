import { test, expect } from '../../fixtures/testFixtures';

/**
 * Concurrency demo (mock target only):
 * Cancel and fill racing on the same pending order must commit exactly one outcome —
 * never both credited shares and a buying-power refund.
 */
test.describe('Regression | Order cancel vs fill race', { tag: ['@regression'] }, () => {
  const raceIterations = [1, 2, 3, 4, 5];

  for (const iteration of raceIterations) {
    test(`iteration ${iteration}: cancel and fill cannot both succeed`, async ({
      apiClient,
      request,
    }) => {
      await request.post('/v1/test/reset');

      const summaryBefore = await apiClient.get('/v1/account/summary');
      const beforeJson = await summaryBefore.json();
      const buyingPowerBefore = beforeJson.buyingPower as number;

      const create = await apiClient.post('/v1/orders', {
        symbol: 'SPCX',
        side: 'buy',
        quantity: 10,
        orderType: 'Limit',
      });
      expect(create.status()).toBe(201);
      const order = await create.json();
      const orderId = order.id as string;

      const race = await request.post(`/v1/test/orders/${orderId}/race-cancel-fill`, {
        headers: { 'x-demo-auth': 'demo-session' },
      });
      expect(race.ok()).toBeTruthy();
      const outcome = await race.json();

      expect(outcome.dualSuccess).toBe(false);
      expect(outcome.cancelAccepted || outcome.fillAccepted).toBeTruthy();
      expect(['filled', 'cancelled']).toContain(outcome.finalStatus);

      const positions = await apiClient.get('/v1/positions');
      const positionsBody = await positions.json();
      const spcx = (positionsBody.positions as Array<{ symbol: string; qty: number }>).find(
        (p) => p.symbol === 'SPCX',
      );

      if (outcome.finalStatus === 'filled') {
        expect(outcome.fillAccepted).toBe(true);
        expect(spcx?.qty ?? 0).toBeGreaterThanOrEqual(10);
        const summaryAfter = await apiClient.get('/v1/account/summary');
        const afterJson = await summaryAfter.json();
        expect(afterJson.buyingPower).toBeLessThan(buyingPowerBefore);
      } else {
        expect(outcome.cancelAccepted).toBe(true);
        expect(outcome.fillAccepted).toBe(false);
        const summaryAfter = await apiClient.get('/v1/account/summary');
        const afterJson = await summaryAfter.json();
        expect(afterJson.buyingPower).toBe(buyingPowerBefore);
        expect(spcx?.qty ?? 0).toBe(0);
      }
    });
  }
});