import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const AdminHero = () => {
  const { toast } = useToast();
  const [heroData, setHeroData] = useState({
    id: '',
    subtitle: '',
    title: '',
    description: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    const { data } = await supabase
      .from('hero_section')
      .select('*')
      .single();
    
    if (data) {
      setHeroData({
        id: data.id,
        subtitle: data.subtitle,
        title: data.title,
        description: data.description,
        image_url: data.image_url || ''
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, file, { upsert: true });

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

    setHeroData({ ...heroData, image_url: publicUrl });
    setLoading(false);
  };

  const handleSave = async () => {
    if (!heroData.subtitle || !heroData.title || !heroData.description) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('hero_section')
      .update({
        subtitle: heroData.subtitle,
        title: heroData.title,
        description: heroData.description,
        image_url: heroData.image_url
      })
      .eq('id', heroData.id);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    toast({
      title: 'Success',
      description: 'Hero section updated successfully',
    });
    
    setLoading(false);
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
                {heroData.image_url && (
                  <img
                    src={heroData.image_url}
                    alt="Hero Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-primary/20"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Upload a new image to replace the hero portrait
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} size="lg" disabled={loading}>
            <Upload className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminHero;
