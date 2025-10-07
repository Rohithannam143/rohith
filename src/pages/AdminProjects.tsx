import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const AdminProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    image_url: '',
    live_url: '',
    github_url: '',
    tags: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) setProjects(data);
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: 'Error',
        description: 'Please fill required fields',
        variant: 'destructive',
      });
      return;
    }

    const tagsArray = newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const { error } = await supabase
      .from('projects')
      .insert([{
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        image_url: newProject.image_url,
        live_url: newProject.live_url,
        github_url: newProject.github_url,
        tags: tagsArray,
        order_index: projects.length
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
      description: 'Project added successfully',
    });

    setNewProject({
      title: '',
      description: '',
      category: 'Web Development',
      image_url: '',
      live_url: '',
      github_url: '',
      tags: ''
    });
    setIsAdding(false);
    fetchProjects();
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
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
      description: 'Project removed successfully',
    });

    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Projects</h2>
          <Button onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isAdding ? 'Cancel' : 'Add New'}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-6 bg-secondary/50 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Project name"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Full Stack"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., React, Node.js, MongoDB"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="live_url">Live URL</Label>
                  <Input
                    id="live_url"
                    placeholder="https://..."
                    value={newProject.live_url}
                    onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    placeholder="https://github.com/..."
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  placeholder="https://..."
                  value={newProject.image_url}
                  onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                />
              </div>
              <Button onClick={handleAddProject} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="p-4 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-xs text-primary">{project.category}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
              {project.tags && (
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag: string, index: number) => (
                    <span key={index} className="text-xs bg-primary/20 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminProjects;
