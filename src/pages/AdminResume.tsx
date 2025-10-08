import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Certification {
  id: string;
  name: string;
  image_url: string;
}

const AdminResume = () => {
  const { toast } = useToast();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCert, setNewCert] = useState({ name: '', image: null as File | null });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) {
      setCertifications(data);
    }
  };

  const handleAddCertification = async () => {
    if (!newCert.name || !newCert.image) {
      toast({
        title: 'Error',
        description: 'Please provide both certification name and image',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const fileExt = newCert.image.name.split('.').pop();
    const fileName = `cert-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, newCert.image, { upsert: true });

    if (uploadError) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from('certifications')
      .insert([
        {
          name: newCert.name,
          image_url: publicUrl,
          order_index: certifications.length
        }
      ]);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    setNewCert({ name: '', image: null });
    setIsAdding(false);
    fetchCertifications();
    
    toast({
      title: 'Success',
      description: 'Certification added successfully',
    });
    setLoading(false);
  };

  const handleDeleteCertification = async (id: string) => {
    const { error } = await supabase
      .from('certifications')
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

    fetchCertifications();
    toast({
      title: 'Deleted',
      description: 'Certification removed successfully',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCert({ ...newCert, image: file });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Certifications</h2>
          <Button onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isAdding ? 'Cancel' : 'Add New'}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-6 bg-secondary/50 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Certification</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cert-name">Certification Name</Label>
                <Input
                  id="cert-name"
                  placeholder="e.g., Advanced React Development"
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cert-image">Certification Image</Label>
                <Input
                  id="cert-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <Button onClick={handleAddCertification} className="w-full" disabled={loading}>
                <Upload className="w-4 h-4 mr-2" />
                {loading ? 'Adding...' : 'Add Certification'}
              </Button>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <Card
              key={cert.id}
              className="p-4 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={cert.image_url}
                  alt={cert.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteCertification(cert.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="font-medium text-center">{cert.name}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card border-border/50">
        <h2 className="text-xl font-bold mb-4">Skills Management</h2>
        <p className="text-muted-foreground">
          Edit your skills and proficiency levels here. Feature coming soon!
        </p>
      </Card>

      <Card className="p-6 bg-card border-border/50">
        <h2 className="text-xl font-bold mb-4">Education Management</h2>
        <p className="text-muted-foreground">
          Add or edit your educational background here. Feature coming soon!
        </p>
      </Card>
    </div>
  );
};

export default AdminResume;
