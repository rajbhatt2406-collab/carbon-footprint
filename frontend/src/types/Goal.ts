export interface Goal {
  id: string;
  userId: string;
  targetValue: number;
  currentProgress: number;
  endDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}
