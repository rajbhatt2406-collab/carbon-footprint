export interface Challenge {
  id: string;
  userId: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  weekStartDate: string;
  dateCompleted?: string;
  createdAt: string;
  updatedAt?: string;
}
