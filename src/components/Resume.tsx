import { useState, useEffect } from 'react';
import { GraduationCap, Award, Code2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

const Resume = () => {
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eduData } = await supabase
        .from('education')
        .select('*')
        .order('order_index', { ascending: true });
      
      const { data: certsData } = await supabase
        .from('certifications')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (eduData) setEducation(eduData);
      if (certsData) setCertifications(certsData);
    };
    
    fetchData();
  }, []);

  const skills = [
    { name: 'React JS', level: 85 },
    { name: 'HTML & CSS & JS', level: 90 },
    { name: 'Python', level: 80 },
    { name: 'Java', level: 75 },
    { name: 'SQL', level: 85 },
    { name: 'Communication', level: 90 },
  ];

  return (
    <section id="resume" className="py-20 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient">Resume</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </div>

        {/* Education */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">Education</h3>
          </div>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card
                key={edu.id}
                className="p-6 bg-card border-l-4 border-l-primary hover:shadow-card hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold mb-1">{edu.degree}</h4>
                    <p className="text-primary font-medium">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-muted-foreground mt-2 md:mt-0">
                    {edu.year}
                  </span>
                </div>
                {edu.description && <p className="text-muted-foreground">{edu.description}</p>}
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">Certifications</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <Dialog key={cert.id}>
                <DialogTrigger asChild>
                  <Card
                    className="p-4 bg-card hover:bg-secondary/50 transition-all duration-300 hover:shadow-card hover:scale-105 border-border/50 animate-fade-in cursor-pointer group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-primary group-hover:animate-pulse" />
                      <p className="font-medium group-hover:text-primary transition-colors">{cert.name}</p>
                    </div>
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={cert.image_url}
                        alt={cert.name}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <img
                    src={cert.image_url}
                    alt={cert.name}
                    className="w-full h-auto rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">My Skills</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="space-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-primary">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2 transition-all duration-1000" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
