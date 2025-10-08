import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Resume', path: '/#resume' },
    { name: 'Portfolio', path: '/#portfolio' },
    { name: 'Blog', path: '/#blog' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.hash === path.replace('/', '');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold text-gradient transform transition-transform duration-300 hover:scale-110"
          >
            RA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={link.path}
                href={link.path}
                className={`relative text-sm font-medium transition-all duration-300 hover:text-primary group ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground/80'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-slide-in-right">
            {navLinks.map((link, index) => (
              <a
                key={link.path}
                href={link.path}
                className={`block text-sm font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground/80'
                }`}
                style={{ 
                  animation: `slide-in-right 0.3s ease-out ${index * 50}ms forwards`,
                  opacity: 0
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {isAuthenticated ? (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
