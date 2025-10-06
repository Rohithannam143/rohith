import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroPortrait from '@/assets/hero-portrait.jpg';

const AdminHero = () => {
  const { toast } = useToast();
  const [heroData, setHeroData] = useState({
    title: 'Turning Vision Into Reality With Code And Design.',
    subtitle: 'Full-Stack Developer',
    description: 'As a skilled full-stack developer, I am dedicated to turning ideas into innovative web applications. Explore my latest projects and articles, showcasing my expertise in React.js and web development.',
    image: heroPortrait,
  });

  const [tempImage, setTempImage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (tempImage) {
      setHeroData({ ...heroData, image: tempImage });
    }
    toast({
      title: 'Success',
      description: 'Hero section updated successfully',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border/50">
        <h2 className="text-2xl font-bold mb-6">Edit Hero Section</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="title">Main Title</Label>
              <Textarea
                id="title"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={heroData.description}
                onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-image">Hero Image</Label>
              <Input
                id="hero-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-4"
              />
              <div className="relative">
                <img
                  src={tempImage || heroData.image}
                  alt="Hero Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-primary/20"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Upload a new image to replace the hero portrait
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} size="lg">
            <Upload className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminHero;
