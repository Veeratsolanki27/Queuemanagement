export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  token?: string;
}

export type TokenStatus = 'WAITING' | 'SERVING' | 'COMPLETED' | 'CANCELLED';

export interface QueueItem {
  id: number;
  name: string;
  description?: string;
  prefix: string;
  currentTokenSequence: number;
  managerId: number;
  managerName: string;
  active: boolean;
  createdAt: string;
  waitingCount: number;
  servingCount: number;
  completedCount: number;
  avgWaitMinutes: number;
}

export interface TokenItem {
  id: number;
  tokenNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceNotes?: string;
  queueId: number;
  queueName: string;
  status: TokenStatus;
  position: number | null;
  createdAt: string;
  servedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  waitTimeSeconds?: number;
  serviceDurationSeconds?: number;
}

export interface AnalyticsData {
  totalTokens: number;
  totalWaiting: number;
  totalServing: number;
  totalCompleted: number;
  totalCancelled: number;
  averageWaitMinutes: number;
  averageServiceMinutes: number;
  queueMetrics: Array<{
    queueId: number;
    queueName: string;
    waitingCount: number;
    servingCount: number;
    completedCount: number;
    cancelledCount: number;
    averageWaitMinutes: number;
    averageServiceMinutes: number;
  }>;
  hourlyTrends: Array<{
    hourLabel: string;
    tokenCount: number;
    averageWaitMinutes: number;
  }>;
  dailyTrends: Array<{
    date: string;
    totalTokens: number;
    completedTokens: number;
    averageWaitMinutes: number;
  }>;
  statusDistribution: {
    WAITING: number;
    SERVING: number;
    COMPLETED: number;
    CANCELLED: number;
  };
}

