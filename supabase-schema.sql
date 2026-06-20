-- Smart Expense Manager Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  category_color TEXT NOT NULL DEFAULT '#818cf8',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If the table already exists, run this to add the missing column:
-- ALTER TABLE expenses ADD COLUMN IF NOT EXISTS category_color TEXT NOT NULL DEFAULT '#818cf8';

-- Create categories table (optional but useful for custom categories)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#818cf8',
  budget DECIMAL(12, 2) DEFAULT 15000.00,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies to ensure users can only access their own data
CREATE POLICY "Users can view their own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Same policies for categories
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically add default categories when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default categories for the new user
  INSERT INTO categories (user_id, name, color, budget)
  VALUES 
    (NEW.id, 'Food & Dining', '#f59e0b', 15000.00),
    (NEW.id, 'Transportation', '#3b82f6', 8000.00),
    (NEW.id, 'Entertainment', '#8b5cf6', 5000.00),
    (NEW.id, 'Shopping', '#ec4899', 10000.00),
    (NEW.id, 'Bills & Utilities', '#10b981', 12000.00),
    (NEW.id, 'Healthcare', '#ef4444', 5000.00),
    (NEW.id, 'Other', '#6b7280', 10000.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();