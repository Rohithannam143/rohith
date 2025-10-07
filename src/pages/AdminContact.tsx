import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const AdminContact = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState({
    id: '',
    email: '',
    phone: '',
    location: '',
    map_latitude: '',
    map_longitude: ''
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    const { data } = await supabase
      .from('contact_info')
      .select('*')
      .single();
    
    if (data) {
      setContactInfo({
        id: data.id,
        email: data.email,
        phone: data.phone,
        location: data.location,
        map_latitude: data.map_latitude?.toString() || '',
        map_longitude: data.map_longitude?.toString() || ''
      });
    }
  };

  const handleSave = async () => {
    if (!contactInfo.email || !contactInfo.phone || !contactInfo.location) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('contact_info')
      .update({
        email: contactInfo.email,
        phone: contactInfo.phone,
        location: contactInfo.location,
        map_latitude: contactInfo.map_latitude ? parseFloat(contactInfo.map_latitude) : null,
        map_longitude: contactInfo.map_longitude ? parseFloat(contactInfo.map_longitude) : null
      })
      .eq('id', contactInfo.id);

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
      description: 'Contact info updated successfully',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border/50">
        <h2 className="text-2xl font-bold mb-6">Edit Contact Information</h2>
        
        <div className="space-y-4 max-w-2xl">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              placeholder="+1 234 567 890"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="City, Country"
              value={contactInfo.location}
              onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Map Latitude</Label>
              <Input
                id="latitude"
                placeholder="e.g., 17.385044"
                value={contactInfo.map_latitude}
                onChange={(e) => setContactInfo({ ...contactInfo, map_latitude: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="longitude">Map Longitude</Label>
              <Input
                id="longitude"
                placeholder="e.g., 78.486671"
                value={contactInfo.map_longitude}
                onChange={(e) => setContactInfo({ ...contactInfo, map_longitude: e.target.value })}
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Tip: Use <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LatLong.net</a> to find coordinates for your location
          </p>

          <Button onClick={handleSave} size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminContact;
