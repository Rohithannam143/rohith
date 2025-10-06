import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import certAiIntro from '@/assets/cert-ai-intro.png';
import certGenAi from '@/assets/cert-gen-ai.png';
import certSql from '@/assets/cert-sql.png';
import certPython from '@/assets/cert-python.png';

const AdminResume = () => {
  const { toast } = useToast();
  const [certifications, setCertifications] = useState([
    { id: 1, name: 'Introduction to AI', image: certAiIntro },
    { id: 2, name: 'Generative AI', image: certGenAi },
    { id: 3, name: 'SQL Database Management', image: certSql },
    { id: 4, name: 'Python Programming', image: certPython },
  ]);

  const [newCert, setNewCert] = useState({ name: '', image: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCertification = () => {
    if (!newCert.name || !newCert.image) {
      toast({
        title: 'Error',
        description: 'Please provide both certification name and image',
        variant: 'destructive',
      });
      return;
    }

    const newCertification = {
      id: Date.now(),
      name: newCert.name,
      image: newCert.image,
    };

    setCertifications([...certifications, newCertification]);
    setNewCert({ name: '', image: '' });
    setIsAdding(false);
    
    toast({
      title: 'Success',
      description: 'Certification added successfully',
    });
  };

  const handleDeleteCertification = (id: number) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
    toast({
      title: 'Deleted',
      description: 'Certification removed successfully',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCert({ ...newCert, image: reader.result as string });
      };
      reader.readAsDataURL(file);
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
                <div className="flex gap-4 items-center">
                  <Input
                    id="cert-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {newCert.image && (
                    <img
                      src={newCert.image}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded border-2 border-primary"
                    />
                  )}
                </div>
              </div>
              <Button onClick={handleAddCertification} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Add Certification
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
                  src={cert.image}
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
