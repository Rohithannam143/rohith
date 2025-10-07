import { useState, useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [filters, setFilters] = useState(['All']);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (data) {
        setProjects(data);
        const categories = ['All', ...new Set(data.map((p: any) => p.category))];
        setFilters(categories as string[]);
      }
    };
    
    fetchProjects();
  }, []);

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient">Portfolio</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter)}
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={project.id}
              className="group overflow-hidden bg-card border-border/50 hover:shadow-card hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.live_url}
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <ExternalLink className="w-5 h-5 text-primary-foreground" />
                  </a>
                  <a
                    href={project.github_url}
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Github className="w-5 h-5 text-primary-foreground" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-primary mb-2 capitalize">
                  {project.category}
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs rounded-full bg-secondary text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
