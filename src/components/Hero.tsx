import { ArrowRight, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroPortrait from '@/assets/hero-portrait.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                Engineering Student
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Turning Vision Into{' '}
              <span className="text-gradient">Reality</span> With Code And Design.
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              As a skilled Engineering Student, I am dedicated to turning ideas into innovative web applications. 
              Explore my latest projects and articles, showcasing my expertise in React.js and web development.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#contact">
                <Button size="lg" className="group hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
                  Get In Touch
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="/Rohith_Resume.pdf" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  View Resume
                </Button>
              </a>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-6 pt-4">
              <a href="tel:+919390140614" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                <Phone className="w-4 h-4" />
                +91 9390140614
              </a>
              <a href="mailto:annamrohith2@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                <Mail className="w-4 h-4" />
                annamrohith2@gmail.com
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
              >
                <Linkedin className="w-5 h-5" />
              </a>
               <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative">
              <img
                src={heroPortrait}
                alt="Rohith Annam - Developer"
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-8 -left-8 bg-card border-2 border-primary rounded-2xl p-6 shadow-card animate-slide-in-right">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">Fresher</p>
                  <p className="text-sm text-muted-foreground">Ready to Build</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
