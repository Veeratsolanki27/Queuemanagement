import apiClient from './client';
import type { QueueItem, TokenItem, AnalyticsData } from '../types';

export const queueApi = {
  getAllQueues: () => apiClient.get<QueueItem[]>('/queues'),
  getMyQueues: () => apiClient.get<QueueItem[]>('/queues/my'),
  getQueueById: (id: number) => apiClient.get<QueueItem>(`/queues/${id}`),
  createQueue: (data: { name: string; description?: string; prefix?: string }) =>
    apiClient.post<QueueItem>('/queues', data),
  deleteQueue: (id: number) => apiClient.delete(`/queues/${id}`),
};

export const tokenApi = {
  getTokensByQueue: (queueId: number) =>
    apiClient.get<TokenItem[]>(`/queues/${queueId}/tokens`),
  getWaitingTokens: (queueId: number) =>
    apiClient.get<TokenItem[]>(`/queues/${queueId}/tokens/waiting`),
  createToken: (
    queueId: number,
    data: {
      customerName: string;
      customerPhone?: string;
      customerEmail?: string;
      serviceNotes?: string;
    }
  ) => apiClient.post<TokenItem>(`/queues/${queueId}/tokens`, data),
  assignTopToken: (queueId: number) =>
    apiClient.post<TokenItem>(`/queues/${queueId}/tokens/assign-top`),
  moveToken: (queueId: number, tokenId: number, direction: 'UP' | 'DOWN') =>
    apiClient.patch<TokenItem[]>(
      `/queues/${queueId}/tokens/tokens/${tokenId}/move?direction=${direction}`
    ),
  cancelToken: (queueId: number, tokenId: number) =>
    apiClient.patch<TokenItem>(`/queues/${queueId}/tokens/tokens/${tokenId}/cancel`),
  completeToken: (queueId: number, tokenId: number) =>
    apiClient.patch<TokenItem>(`/queues/${queueId}/tokens/tokens/${tokenId}/complete`),
};

export const analyticsApi = {
  getDashboard: () => apiClient.get<AnalyticsData>('/analytics/dashboard'),
};

