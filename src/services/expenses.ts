import { supabase } from "../lib/supabase";

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

export interface UpdateExpenseData extends Partial<CreateExpenseData> {}

// Get all expenses for the current user
export async function getExpenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data as Expense[];
}

// Get expenses with filters (date range, category)
export async function getExpensesWithFilters(filters?: {
  startDate?: string;
  endDate?: string;
  category?: string;
}) {
  let query = supabase.from("expenses").select("*");

  if (filters?.startDate) {
    query = query.gte("date", filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte("date", filters.endDate);
  }
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query.order("date", { ascending: false });

  if (error) throw error;
  return data as Expense[];
}

// Create a new expense
export async function createExpense(expenseData: CreateExpenseData) {
  const { data, error } = await supabase
    .from("expenses")
    .insert([expenseData])
    .select()
    .single();

  if (error) throw error;
  return data as Expense;
}

// Update an existing expense
export async function updateExpense(id: string, updates: UpdateExpenseData) {
  const { data, error } = await supabase
    .from("expenses")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Expense;
}

// Delete an expense
export async function deleteExpense(id: string) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// Get total expenses for a period
export async function getTotalExpenses(startDate?: string, endDate?: string) {
  let query = supabase.from("expenses").select("amount");

  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  
  return data.reduce((sum, item) => sum + item.amount, 0);
}

// Get expenses grouped by category
export async function getExpensesByCategory(startDate?: string, endDate?: string) {
  const expenses = await getExpensesWithFilters({ startDate, endDate });
  
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
}