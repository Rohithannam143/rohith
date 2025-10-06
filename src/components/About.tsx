import { Code, Database, Globe, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import profileAvatar from '@/assets/profile-avatar.jpg';

const About = () => {
  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Building high-quality, responsive websites using modern technologies like React.js and modern frameworks.',
    },
    {
      icon: Code,
      title: 'Frontend Development',
      description: 'Creating beautiful and intuitive user interfaces with HTML, CSS, JavaScript, and React.',
    },
    {
      icon: Database,
      title: 'Backend Development',
      description: 'Developing robust server-side applications with SQL databases and modern backend technologies.',
    },
    {
      icon: Smartphone,
      title: 'Problem Solving',
      description: 'Implementing efficient algorithms and data structures to solve complex technical challenges.',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-start animate-slide-in-right">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-primary/20">
                <img
                  src={profileAvatar}
                  alt="Rohith Annam"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>

          {/* About Content */}
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-3xl font-bold">
              Computer Science Engineering Student & Aspiring Developer
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              I'm a passionate B.Tech Computer Science Engineering student from Mancherial, Telangana, 
              dedicated to leading the development of revolutionary AI platforms that will enhance 
              technological experiences.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              My goal is to build applications that are not only functional and user-friendly but also 
              attractive and innovative. I collaborate with cross-functional teams to deliver projects 
              on time, within budget, and with the highest quality standards.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold">Mancherial, Telangana</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">Available for Work</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Education</p>
                <p className="font-semibold">B.Tech CSE</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-semibold">Fresher</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-12 animate-fade-in">
            What I <span className="text-gradient">Do</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-6 bg-card hover:bg-secondary/50 transition-all duration-300 hover:shadow-card hover:shadow-primary/20 hover:-translate-y-2 border-border/50 animate-fade-in group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
