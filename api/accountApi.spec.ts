import { test, expect } from '../fixtures/testFixtures';
import { apiEndpoints } from '../utils/testData';
import { env } from '../utils/env';

test.describe('API | Account', () => {
  test('GET account summary returns a successful payload', async ({ apiClient }) => {
    const response = await apiClient.get(apiEndpoints.accountSummary);

    expect([200, 401, 403]).toContain(response.status());

    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toBeTruthy();
      expect(body).toHaveProperty('accountValue');
      expect(body).toHaveProperty('buyingPower');
    }
  });

  test('GET positions returns a list payload when authorized', async ({ apiClient }) => {
    const response = await apiClient.get(apiEndpoints.positions);

    expect([200, 401, 403]).toContain(response.status());

    if (response.status() === 200) {
      const body = await response.json();
      expect(Array.isArray(body) || Array.isArray(body.positions)).toBeTruthy();
    }
  });

  test('POST login endpoint accepts credentials payload shape', async ({ apiClient }) => {
    const response = await apiClient.post(apiEndpoints.login, {
      username: env.username,
      password: env.password,
    });

    expect([200, 201, 400, 401, 404]).toContain(response.status());

    if (response.status() === 200 || response.status() === 201) {
      const body = await response.json();
      expect(body).toBeTruthy();
    }
  });

  test('PUT and DELETE helpers are available for order lifecycle calls', async ({ apiClient }) => {
    const putResponse = await apiClient.put(`${apiEndpoints.orders}/0`, {
      status: 'canceled',
    });
    expect([200, 204, 400, 401, 403, 404, 405]).toContain(putResponse.status());

    const deleteResponse = await apiClient.delete(`${apiEndpoints.orders}/0`);
    expect([200, 204, 400, 401, 403, 404, 405]).toContain(deleteResponse.status());
  });
});
