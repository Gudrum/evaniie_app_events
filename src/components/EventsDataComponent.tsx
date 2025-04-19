'use client';

import { useEffect, useState } from 'react';
import { EventCard } from './EventCard';
import { API_ROUTES } from '@/app/api/routes';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
  endDate: string | null;
  location: string;
  address: string;
  city: string;
  price: number | null;
  capacity: number | null;
  organizer: {
    id: string;
    name: string;
    image: string | null;
  };
  categories: {
    id: string;
    name: string;
  }[];
  _count: {
    attendees: number;
  };
  featured: boolean;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

// Datos de ejemplo en caso de que la API falle
const EXAMPLE_EVENTS: Event[] = [
  {
    id: "example-1",
    title: "Festival Gastronómico Internacional",
    description: "Descubre sabores de todo el mundo en el festival gastronómico más esperado del año.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2874&auto=format&fit=crop",
    date: new Date(2025, 5, 15, 11, 0).toISOString(),
    endDate: new Date(2025, 5, 17, 22, 0).toISOString(),
    location: "Parque Central",
    address: "Avenida Principal 123",
    city: "Ciudad de México",
    price: 250,
    capacity: 5000,
    organizer: {
      id: "admin-1",
      name: "Organizador Cultural",
      image: null,
    },
    categories: [
      { id: "cat-1", name: "Gastronomía" }
    ],
    _count: {
      attendees: 120,
    },
    featured: true,
    status: "UPCOMING",
  },
  {
    id: "example-2",
    title: "Concierto Sinfónica Nacional",
    description: "La Orquesta Sinfónica presenta una noche mágica de música clásica.",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=2940&auto=format&fit=crop",
    date: new Date(2025, 4, 25, 19, 30).toISOString(),
    endDate: new Date(2025, 4, 25, 22, 0).toISOString(),
    location: "Palacio de Bellas Artes",
    address: "Av. Juárez y Eje Central",
    city: "Ciudad de México",
    price: 500,
    capacity: 1800,
    organizer: {
      id: "admin-1",
      name: "Organizador Cultural",
      image: null,
    },
    categories: [
      { id: "cat-2", name: "Música" }
    ],
    _count: {
      attendees: 320,
    },
    featured: true,
    status: "UPCOMING",
  },
  {
    id: "example-3",
    title: "Urban Battle: Hip Hop",
    description: "Los mejores bailarines de hip hop se reúnen en esta competición.",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2938&auto=format&fit=crop",
    date: new Date(2025, 7, 5, 16, 0).toISOString(),
    endDate: new Date(2025, 7, 7, 23, 0).toISOString(),
    location: "Arena Ciudad",
    address: "Insurgentes Sur 4000",
    city: "Ciudad de México",
    price: 350,
    capacity: 3000,
    organizer: {
      id: "admin-1",
      name: "Organizador Cultural",
      image: null,
    },
    categories: [
      { id: "cat-3", name: "Danza" },
      { id: "cat-4", name: "Arte Urbano" }
    ],
    _count: {
      attendees: 250,
    },
    featured: false,
    status: "UPCOMING",
  }
];

export function EventsDataComponent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        setLoading(true);

        // Intentamos obtener los eventos desde la API
        const response = await fetch(API_ROUTES.EVENTS, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Error al obtener eventos: ${response.status}`);
        }

        const data = await response.json();
        console.log('Events data received:', data);

        // Si hay eventos en la respuesta, los usamos
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
          setUsingFallback(false);
        } else {
          // Si no hay eventos, usamos los datos de ejemplo
          console.log('No events found in API, using example data');
          setEvents(EXAMPLE_EVENTS);
          setUsingFallback(true);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        console.log('Using fallback example data due to API error');
        setEvents(EXAMPLE_EVENTS);
        setUsingFallback(true);
        setError(null); // No mostramos error al usuario porque tenemos datos de respaldo
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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

  // Si no hay eventos, mostrar mensaje apropiado
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-6">No hay eventos disponibles en este momento.</p>
        <Button asChild variant="outline">
          <a href={API_ROUTES.EVENTS} target="_blank" rel="noopener noreferrer">
            Ver respuesta API
          </a>
        </Button>
      </div>
    );
  }

  // Agrupar eventos por destacados y no destacados
  const featuredEvents = events.filter(event => event.featured);
  const regularEvents = events.filter(event => !event.featured);

  return (
    <div className="space-y-10">
      {usingFallback && (
        <Alert className="mb-4 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-400">Modo de demostración</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-500">
            Mostrando eventos de ejemplo porque no se pudieron cargar los datos desde la API.
          </AlertDescription>
        </Alert>
      )}

      {featuredEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-medium mb-6">Eventos destacados</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                imageUrl={event.imageUrl}
                date={new Date(event.date)}
                endDate={event.endDate ? new Date(event.endDate) : null}
                location={event.location}
                city={event.city}
                price={event.price}
                categories={event.categories}
                attendeeCount={event._count.attendees}
                featured={event.featured}
                status={event.status}
              />
            ))}
          </div>
        </div>
      )}

      {regularEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-medium mb-6">Próximos eventos</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                imageUrl={event.imageUrl}
                date={new Date(event.date)}
                endDate={event.endDate ? new Date(event.endDate) : null}
                location={event.location}
                city={event.city}
                price={event.price}
                categories={event.categories}
                attendeeCount={event._count.attendees}
                featured={event.featured}
                status={event.status}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
