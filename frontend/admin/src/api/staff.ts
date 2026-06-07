import { apiClient } from './client';

export const staffApi = {
  scanTicket: async (token: string) => {
    const res = await apiClient.post('/staff/scan', { token });
    return res;
  }
};
