import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const AdminEducation = () => {
  const { toast } = useToast();
  const [education, setEducation] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: '',
    description: ''
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    const { data } = await supabase
      .from('education')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) setEducation(data);
  };

  const handleAddEducation = async () => {
    if (!newEducation.degree || !newEducation.institution || !newEducation.year) {
      toast({
        title: 'Error',
        description: 'Please fill required fields',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('education')
      .insert([{
        degree: newEducation.degree,
        institution: newEducation.institution,
        year: newEducation.year,
        description: newEducation.description,
        order_index: education.length
      }]);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Education added successfully',
    });

    setNewEducation({ degree: '', institution: '', year: '', description: '' });
    setIsAdding(false);
    fetchEducation();
  };

  const handleDeleteEducation = async (id: string) => {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Deleted',
      description: 'Education removed successfully',
    });

    fetchEducation();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Education</h2>
          <Button onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isAdding ? 'Cancel' : 'Add New'}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-6 bg-secondary/50 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Education</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  placeholder="e.g., B.Tech in Computer Science"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  placeholder="University or College name"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  placeholder="e.g., 2022-2026"
                  value={newEducation.year}
                  onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details..."
                  value={newEducation.description}
                  onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button onClick={handleAddEducation} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {education.map((edu) => (
            <Card
              key={edu.id}
              className="p-4 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{edu.degree}</h3>
                  <p className="text-primary">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.year}</p>
                  {edu.description && <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteEducation(edu.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminEducation;
