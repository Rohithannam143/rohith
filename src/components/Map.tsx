import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/lib/supabase';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: 17.385044, lng: 78.486671 });

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data } = await supabase
        .from('contact_info')
        .select('map_latitude, map_longitude')
        .single();
      
      if (data && data.map_latitude && data.map_longitude) {
        setCoordinates({ 
          lat: Number(data.map_latitude), 
          lng: Number(data.map_longitude) 
        });
      }
    };
    
    fetchContactInfo();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Using a public token - in production, get your own from mapbox.com
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTVyZDg1cW4wMjZ4MmpzaGZxZWwxZG93In0.UKNbRiFVJhLY5mMh0HmGPw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [coordinates.lng, coordinates.lat],
      zoom: 12,
    });

    // Add marker
    new mapboxgl.Marker({ color: '#f59e0b' })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

  }, [coordinates]);

  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
