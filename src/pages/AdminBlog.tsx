import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const AdminBlog = () => {
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Development',
    read_time: '5 min read',
    image_url: ''
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_date', { ascending: false });
    
    if (data) setBlogPosts(data);
  };

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.excerpt) {
      toast({
        title: 'Error',
        description: 'Please fill required fields',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('blog_posts')
      .insert([{
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        category: newPost.category,
        read_time: newPost.read_time,
        image_url: newPost.image_url,
        published_date: new Date().toISOString().split('T')[0]
      }]);

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
      description: 'Blog post added successfully',
    });

    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      category: 'Development',
      read_time: '5 min read',
      image_url: ''
    });
    setIsAdding(false);
    fetchBlogPosts();
  };

  const handleDeletePost = async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Deleted',
      description: 'Blog post removed successfully',
    });

    fetchBlogPosts();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
          <Button onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isAdding ? 'Cancel' : 'Add New'}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-6 bg-secondary/50 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Blog Post</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Blog post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Development"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Short description..."
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Full article content..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    placeholder="e.g., 5 min read"
                    value={newPost.read_time}
                    onChange={(e) => setNewPost({ ...newPost, read_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    placeholder="https://..."
                    value={newPost.image_url}
                    onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddPost} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Add Blog Post
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="p-4 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    <span className="text-xs bg-primary/20 px-2 py-1 rounded">{post.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.published_date).toLocaleDateString()} • {post.read_time}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminBlog;
