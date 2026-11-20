export const env = {
  mockPort: Number(process.env.MOCK_PORT || 4173),
  mockHost: process.env.MOCK_HOST || '127.0.0.1',
};

export function mockBaseUrl(): string {
  return `http://${env.mockHost}:${env.mockPort}`;
}