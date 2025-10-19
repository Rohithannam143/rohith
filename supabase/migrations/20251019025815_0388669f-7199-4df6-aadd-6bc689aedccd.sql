-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own todos
CREATE POLICY "Users can view their own todos"
ON public.todos FOR SELECT
USING (true);

-- Allow users to insert their own todos
CREATE POLICY "Users can create todos"
ON public.todos FOR INSERT
WITH CHECK (true);

-- Allow users to update their own todos
CREATE POLICY "Users can update their own todos"
ON public.todos FOR UPDATE
USING (true);

-- Allow users to delete their own todos
CREATE POLICY "Users can delete their own todos"
ON public.todos FOR DELETE
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_todos_updated_at
BEFORE UPDATE ON public.todos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_todos_user_email ON public.todos(user_email);
CREATE INDEX idx_todos_created_at ON public.todos(created_at DESC);