import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ title: '', description: '', icon: 'Code' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) setServices(data);
  };

  const handleAddService = async () => {
    if (!newService.title || !newService.description) {
      toast({
        title: 'Error',
        description: 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('services')
      .insert([{
        title: newService.title,
        description: newService.description,
        icon: newService.icon,
        order_index: services.length
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
      description: 'Service added successfully',
    });

    setNewService({ title: '', description: '', icon: 'Code' });
    setIsAdding(false);
    fetchServices();
  };

  const handleDeleteService = async (id: string) => {
    const { error } = await supabase
      .from('services')
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
      description: 'Service removed successfully',
    });

    fetchServices();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Services (What I Do)</h2>
          <Button onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isAdding ? 'Cancel' : 'Add New'}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-6 bg-secondary/50 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="service-title">Title</Label>
                <Input
                  id="service-title"
                  placeholder="e.g., Web Development"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="service-description">Description</Label>
                <Textarea
                  id="service-description"
                  placeholder="Describe the service..."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="service-icon">Icon</Label>
                <Select
                  value={newService.icon}
                  onValueChange={(value) => setNewService({ ...newService, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Code">Code</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Globe">Globe</SelectItem>
                    <SelectItem value="Smartphone">Smartphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddService} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className="p-4 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold">{service.title}</h3>
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
              <p className="text-xs text-primary">Icon: {service.icon}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminServices;
