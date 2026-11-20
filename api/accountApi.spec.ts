import { test, expect } from '../fixtures/testFixtures';
import { apiEndpoints } from '../utils/testData';
import { env } from '../utils/env';

test.describe('API | Account & orders', { tag: ['@api'] }, () => {
  test('GET account summary returns portfolio mock balances', async ({ apiClient }) => {
    const response = await apiClient.get(apiEndpoints.accountSummary);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('accountValue');
    expect(body).toHaveProperty('buyingPower');
    expect(body.accountValue).toBeGreaterThan(0);
  });

  test('GET positions returns an array for the mock book', async ({ apiClient }) => {
    const response = await apiClient.get(apiEndpoints.positions);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.positions)).toBeTruthy();
  });

  test('POST login accepts demo credentials', async ({ apiClient, request }) => {
    const response = await apiClient.post(apiEndpoints.login, {
      username: env.username,
      password: env.password,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();

    const authed = await request.get('/v1/watchlist', {
      headers: { 'x-demo-auth': 'demo-session' },
    });
    expect(authed.ok()).toBeTruthy();
  });

  test('order lifecycle supports create, fill, and cancel via HTTP', async ({ apiClient, request }) => {
    await request.post('/v1/test/reset');

    const create = await apiClient.post(apiEndpoints.orders, {
      symbol: 'AAPL',
      side: 'buy',
      quantity: 5,
      orderType: 'Market',
    });
    expect(create.status()).toBe(201);
    const created = await create.json();

    const fill = await apiClient.put(`${apiEndpoints.orders}/${created.id}`, { status: 'filled' });
    expect(fill.status()).toBe(200);

    const createPending = await apiClient.post(apiEndpoints.orders, {
      symbol: 'SPY',
      side: 'buy',
      quantity: 2,
      orderType: 'Limit',
    });
    const pending = await createPending.json();

    const cancel = await apiClient.delete(`${apiEndpoints.orders}/${pending.id}`);
    expect([200, 204]).toContain(cancel.status());
  });
});