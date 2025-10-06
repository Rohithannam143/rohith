import { GraduationCap, Award, Code2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Resume = () => {
  const education = [
    {
      degree: 'B.Tech (Computer Science & Engineering)',
      institution: 'University',
      period: '2023 - Pursuing',
      description: 'Courses included Data Structures, Algorithms, Computer Architecture, Operating Systems, and Software Engineering. Participated in consulting projects for startups.',
    },
    {
      degree: 'Intermediate (MPC)',
      institution: 'Govt Junior College, Kaipet',
      period: '2021 - 2023',
      description: 'Focused on Mathematics, Physics, and Chemistry with strong foundational knowledge.',
    },
    {
      degree: 'SSC (Secondary School Certificate)',
      institution: 'ZP High School, Dharmaraopet',
      period: '2016 - 2021',
      description: 'Completed secondary education with excellent grades.',
    },
  ];

  const certifications = [
    'Introduction to AI',
    'Generative AI',
    'SQL Database Management',
    'Python Programming',
  ];

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
                key={index}
                className="p-6 bg-card border-l-4 border-l-primary hover:shadow-card transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold mb-1">{edu.degree}</h4>
                    <p className="text-primary font-medium">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-muted-foreground mt-2 md:mt-0">
                    {edu.period}
                  </span>
                </div>
                <p className="text-muted-foreground">{edu.description}</p>
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
              <Card
                key={index}
                className="p-4 bg-card hover:bg-secondary/50 transition-all duration-300 hover:shadow-card border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="font-medium">{cert}</p>
                </div>
              </Card>
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
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
