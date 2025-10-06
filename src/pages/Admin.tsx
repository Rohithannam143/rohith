import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, FileText, Briefcase, BookOpen, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AdminResume from './AdminResume';
import AdminHero from './AdminHero';

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blog Posts</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Certifications</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-card border-border/50">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4">
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold">Add New Project</p>
                    <p className="text-xs text-muted-foreground">Create a new portfolio project</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4">
                  <BookOpen className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold">Write Blog Post</p>
                    <p className="text-xs text-muted-foreground">Share your thoughts and ideas</p>
                  </div>
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Hero Management */}
          <TabsContent value="hero" className="space-y-6">
            <AdminHero />
          </TabsContent>

          {/* Resume Management */}
          <TabsContent value="resume" className="space-y-6">
            <AdminResume />
          </TabsContent>

          {/* Projects Management */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="p-6 bg-card border-border/50">
              <h2 className="text-xl font-bold mb-4">Projects Management</h2>
              <p className="text-muted-foreground">
                Add, edit, or delete your portfolio projects here.
                Feature coming soon!
              </p>
            </Card>
          </TabsContent>

          {/* Blog Management */}
          <TabsContent value="blog" className="space-y-6">
            <Card className="p-6 bg-card border-border/50">
              <h2 className="text-xl font-bold mb-4">Blog Management</h2>
              <p className="text-muted-foreground">
                Create and manage your blog posts here.
                Feature coming soon!
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
