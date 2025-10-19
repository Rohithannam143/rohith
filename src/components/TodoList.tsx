import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Sparkles, Mail, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium' as const });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to load todos', variant: 'destructive' });
    } else {
      setTodos((data || []) as Todo[]);
    }
  };

  const addTodo = async () => {
    if (!newTodo.title.trim() || !userEmail.trim()) {
      toast({ title: 'Error', description: 'Please fill in title and email', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('todos').insert({
      user_email: userEmail,
      title: newTodo.title,
      description: newTodo.description,
      priority: newTodo.priority,
      due_date: dueDate || null,
    });

    if (error) {
      toast({ title: 'Error', description: 'Failed to add todo', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: '✅ Todo added successfully!' });
      setNewTodo({ title: '', description: '', priority: 'medium' });
      setDueDate('');
      fetchTodos();
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: 'Error', description: 'Please enter a description for AI', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-todo', {
        body: { action: 'generate', todoDescription: aiPrompt }
      });

      if (error) throw error;

      toast({ 
        title: '🤖 AI Suggestions', 
        description: data.suggestions,
        duration: 10000 
      });
      setAiPrompt('');
    } catch (error) {
      toast({ title: 'Error', description: 'AI generation failed', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailNotification = async (todo: Todo) => {
    if (!userEmail.trim()) {
      toast({ title: 'Error', description: 'Please enter your email first', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('ai-todo', {
        body: {
          action: 'notify',
          userEmail,
          title: todo.title,
          priority: todo.priority,
          dueDate: todo.due_date
        }
      });

      if (error) throw error;

      toast({ title: '📧 Email Sent', description: 'Notification sent to your email!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send email', variant: 'destructive' });
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update todo', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: completed ? '🔄 Marked incomplete' : '✅ Completed!' });
      fetchTodos();
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete todo', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: '🗑️ Todo deleted' });
      fetchTodos();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8 border-2 border-primary/20 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="text-3xl font-bold text-gradient flex items-center gap-2">
            ✨ AI-Powered Todo List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">📧 Your Email (for notifications)</label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="border-2"
            />
          </div>

          {/* AI Generation */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Generate Todos with AI
            </label>
            <div className="flex gap-2">
              <Textarea
                placeholder="E.g., 'I need to prepare for my project presentation next week'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[80px] border-2"
              />
            </div>
            <Button 
              onClick={generateWithAI} 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/80"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isLoading ? 'Generating...' : 'Generate with AI'}
            </Button>
          </div>

          {/* Manual Todo Creation */}
          <div className="space-y-4 pt-4 border-t">
            <label className="text-sm font-medium">📝 Add Todo Manually</label>
            <Input
              placeholder="Todo title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="border-2"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="min-h-[60px] border-2"
            />
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Priority</label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                  className="w-full p-2 border-2 rounded-md bg-background"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Due Date (optional)</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-2"
                />
              </div>
            </div>

            <Button onClick={addTodo} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Todo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Todos List */}
      <div className="space-y-4">
        {todos.map((todo) => (
          <Card 
            key={todo.id} 
            className={`transition-all hover:shadow-lg ${todo.completed ? 'opacity-60' : ''}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold text-lg ${todo.completed ? 'line-through' : ''}`}>
                      {todo.title}
                    </h3>
                    <Badge className={getPriorityColor(todo.priority)}>
                      {todo.priority}
                    </Badge>
                  </div>
                  {todo.description && (
                    <p className="text-muted-foreground text-sm mb-2">{todo.description}</p>
                  )}
                  {todo.due_date && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      Due: {format(new Date(todo.due_date), 'MMM dd, yyyy')}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendEmailNotification(todo)}
                      className="text-xs"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email Reminder
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-xs"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {todos.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No todos yet. Add one above or generate with AI! 🚀</p>
          </Card>
        )}
      </div>
    </div>
  );
}