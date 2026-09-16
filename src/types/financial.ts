export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseData {
  amount: number;
  description: string;
  category: string;
  date?: string;
}

export type UpdateExpenseData = Partial<CreateExpenseData>;
