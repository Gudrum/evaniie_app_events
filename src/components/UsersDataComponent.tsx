'use client';

import { useEffect, useState } from 'react';
import { UserCard } from './UserCard';
import { API_ROUTES } from '@/app/api/routes';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export function UsersDataComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ROUTES.USERS);

        if (!response.ok) {
          throw new Error(`Error al obtener usuarios: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('No se pudieron cargar los usuarios. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  if (users.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-6">No hay usuarios registrados aún.</p>
        <Button asChild variant="outline">
          <a href={API_ROUTES.USERS} target="_blank" rel="noopener noreferrer">
            Ver respuesta API
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          name={user.name}
          email={user.email}
          image={user.image}
          bio={user.bio}
          role={user.role}
        />
      ))}
    </div>
  );
}
