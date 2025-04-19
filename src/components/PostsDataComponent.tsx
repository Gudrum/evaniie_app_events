'use client';

import { useEffect, useState } from 'react';
import { PostCard } from './PostCard';
import { API_ROUTES } from '@/app/api/routes';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  categories: {
    id: string;
    name: string;
  }[];
  _count: {
    comments: number;
  };
  createdAt: string;
}

export function PostsDataComponent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ROUTES.POSTS);

        if (!response.ok) {
          throw new Error(`Error al obtener posts: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.posts);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('No se pudieron cargar los posts. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-6">No hay posts publicados aún.</p>
        <Button asChild variant="outline">
          <a href={API_ROUTES.POSTS} target="_blank" rel="noopener noreferrer">
            Ver respuesta API
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          author={post.author}
          categories={post.categories}
          commentCount={post._count.comments}
          createdAt={new Date(post.createdAt)}
        />
      ))}
    </div>
  );
}
