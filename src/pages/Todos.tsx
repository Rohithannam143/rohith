import Navigation from '@/components/Navigation';
import TodoList from '@/components/TodoList';
import Footer from '@/components/Footer';

const Todos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <TodoList />
      </div>
      <Footer />
    </div>
  );
};

export default Todos;