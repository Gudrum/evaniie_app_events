import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { EventDetail } from '@/components/EventDetail';
import prisma from '@/lib/prisma';

interface EventPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  try {
    // Si el ID comienza con "example-", es un evento de ejemplo
    if (params.id.startsWith('example-')) {
      return {
        title: `Evento de ejemplo | Cultura`,
        description: 'Detalle de un evento de demostración',
      };
    }

    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!event) {
      return {
        title: 'Evento no encontrado',
        description: 'El evento que buscas no existe o ha sido eliminado',
      };
    }

    return {
      title: `${event.title} | Cultura`,
      description: event.description,
      openGraph: {
        title: event.title,
        description: event.description,
        images: event.imageUrl ? [event.imageUrl] : [],
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error obteniendo metadata del evento:', error);
    return {
      title: 'Detalles del evento | Cultura',
      description: 'Información detallada sobre este evento cultural',
    };
  }
}

// Datos de ejemplo para eventos de demostración
const EXAMPLE_EVENT = {
  id: "example-1",
  title: "Festival Gastronómico Internacional",
  description: "Descubre sabores de todo el mundo en el festival gastronómico más esperado del año. Chefs reconocidos presentarán sus creaciones culinarias, talleres de cocina y degustaciones de platos emblemáticos de diferentes culturas. Una experiencia sensorial única donde podrás explorar la riqueza culinaria de países como Italia, Japón, México, India, Francia y muchos más.\n\nActividades incluidas:\n- Degustaciones de platillos internacionales\n- Talleres de cocina con chefs reconocidos\n- Catas de vinos y maridajes\n- Concursos culinarios\n- Área especial para niños con actividades temáticas",
  imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2874&auto=format&fit=crop",
  date: new Date(2025, 5, 15, 11, 0),
  endDate: new Date(2025, 5, 17, 22, 0),
  location: "Parque Central",
  address: "Avenida Principal 123",
  city: "Ciudad de México",
  price: 250,
  capacity: 5000,
  organizer: {
    id: "admin-1",
    name: "Organizador Cultural",
    image: null,
    bio: "Organizador especializado en eventos culturales y gastronómicos de alto nivel en México y Latinoamérica."
  },
  categories: [
    { id: "cat-1", name: "Gastronomía" },
    { id: "cat-5", name: "Festival" }
  ],
  attendees: [],
  _count: {
    attendees: 120,
  },
  featured: true,
  status: "UPCOMING",
  createdAt: new Date(2023, 1, 1),
  updatedAt: new Date(2023, 1, 1),
};

export default async function EventPage({ params }: EventPageProps) {
  try {
    // Si el ID comienza con "example-", mostrar un evento de ejemplo
    if (params.id.startsWith('example-')) {
      return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
          <EventDetail event={EXAMPLE_EVENT} isExampleMode={true} />
        </div>
      );
    }

    // Obtener los datos del evento desde la base de datos
    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        categories: true,
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    });

    // Si el evento no existe, mostrar 404
    if (!event) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <EventDetail event={event} />
      </div>
    );
  } catch (error) {
    console.error('Error obteniendo detalles del evento:', error);
    notFound();
  }
}
