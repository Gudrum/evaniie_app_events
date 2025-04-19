'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, MapPin, Clock, Ticket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EventCard } from './EventCard';
import { API_ROUTES } from '@/app/api/routes';

// Tipos de eventos
const EVENT_TYPES = [
  { id: 'all', name: 'Todos los tipos' },
  { id: 'concierto', name: 'Concierto' },
  { id: 'exposicion', name: 'Exposición de Arte' },
  { id: 'festival', name: 'Festival' },
  { id: 'teatro', name: 'Teatro' },
  { id: 'danza', name: 'Danza' },
  { id: 'taller', name: 'Taller' },
  { id: 'gastronomia', name: 'Gastronomía' },
  { id: 'cine', name: 'Cine' },
  { id: 'literatura', name: 'Literatura' },
];

// Categorías
const CATEGORIES = [
  { id: 'all', name: 'Todas las categorías' },
  { id: 'musica', name: 'Música' },
  { id: 'arte', name: 'Arte' },
  { id: 'gastronomia', name: 'Gastronomía' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'educativo', name: 'Educativo' },
  { id: 'entretenimiento', name: 'Entretenimiento' },
  { id: 'deportivo', name: 'Deportivo' },
  { id: 'familiar', name: 'Familiar' },
  { id: 'tecnologia', name: 'Tecnología' },
];

// Ciudades
const CITIES = [
  { id: 'all', name: 'Todas las ciudades' },
  { id: 'cdmx', name: 'Ciudad de México' },
  { id: 'guadalajara', name: 'Guadalajara' },
  { id: 'monterrey', name: 'Monterrey' },
  { id: 'puebla', name: 'Puebla' },
  { id: 'queretaro', name: 'Querétaro' },
];

// Ordenar por
const SORT_OPTIONS = [
  { id: 'date-asc', name: 'Fecha (más próxima)' },
  { id: 'date-desc', name: 'Fecha (más lejana)' },
  { id: 'price-asc', name: 'Precio (menor a mayor)' },
  { id: 'price-desc', name: 'Precio (mayor a menor)' },
  { id: 'popular', name: 'Popularidad' },
];

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string | null;
  location: string;
  city: string;
  price: number | null;
  categories: {
    id: string;
    name: string;
  }[];
  eventType: {
    id: string;
    name: string;
  };
  _count: {
    registrations: number;
  };
  published: boolean;
  allowRegistration: boolean;
}

export default function EventsExplorer() {
  // Estado para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('all');
  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');
  const [onlyFree, setOnlyFree] = useState(false);

  // Estado para resultados y carga
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_ROUTES.EVENTS}?published=true`);

        if (!response.ok) {
          throw new Error(`Error al cargar eventos: ${response.status}`);
        }

        const data = await response.json();
        if (data.events && data.events.length > 0) {
          // Solo eventos publicados
          const publishedEvents = data.events.filter((event: Event) => event.published);
          setEvents(publishedEvents);
          setFilteredEvents(publishedEvents);
        } else {
          // Usar datos de ejemplo si no hay eventos
          setEvents([]);
          setFilteredEvents([]);
          setError('No hay eventos disponibles en este momento.');
        }
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setError('No se pudieron cargar los eventos. Inténtalo de nuevo más tarde.');
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Aplicar filtros y búsqueda
  useEffect(() => {
    if (events.length === 0) return;

    let result = [...events];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }

    // Filtrar por tipo de evento
    if (eventType !== 'all') {
      result = result.filter(event => event.eventType.id === eventType);
    }

    // Filtrar por categoría
    if (category !== 'all') {
      result = result.filter(event =>
        event.categories.some(cat => cat.id === category || cat.name.toLowerCase() === category.toLowerCase())
      );
    }

    // Filtrar por ciudad
    if (city !== 'all') {
      result = result.filter(event =>
        event.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filtrar solo eventos gratuitos
    if (onlyFree) {
      result = result.filter(event => event.price === 0 || event.price === null);
    }

    // Ordenar resultados
    switch (sortBy) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        result.sort((a, b) => b._count.registrations - a._count.registrations);
        break;
    }

    setFilteredEvents(result);
  }, [events, searchTerm, eventType, category, city, sortBy, onlyFree]);

  // Resetear todos los filtros
  const handleResetFilters = () => {
    setSearchTerm('');
    setEventType('all');
    setCategory('all');
    setCity('all');
    setSortBy('date-asc');
    setOnlyFree(false);
  };

  return (
    <div className="space-y-8">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Buscar eventos..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(option => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtrar eventos</SheetTitle>
              </SheetHeader>

              <div className="space-y-6 py-4">
                {/* Tipo de evento */}
                <div className="space-y-2">
                  <Label className="font-medium">Tipo de evento</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <Label className="font-medium">Categoría</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ciudad */}
                <div className="space-y-2">
                  <Label className="font-medium">Ciudad</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las ciudades" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Solo eventos gratuitos */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="only-free" className="font-medium">Solo eventos gratuitos</Label>
                  <Switch
                    id="only-free"
                    checked={onlyFree}
                    onCheckedChange={setOnlyFree}
                  />
                </div>
              </div>

              <SheetFooter className="pt-2 border-t flex flex-row gap-2 justify-between">
                <Button variant="outline" onClick={handleResetFilters}>
                  Resetear filtros
                </Button>
                <SheetClose asChild>
                  <Button>Aplicar filtros</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Indicador de filtros activos */}
          {(eventType !== 'all' || category !== 'all' || city !== 'all' || onlyFree) && (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="gap-1"
            >
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros activos */}
      <div className="flex flex-wrap gap-2">
        {eventType !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            <Calendar className="h-3 w-3" />
            {EVENT_TYPES.find(t => t.id === eventType)?.name}
            <button onClick={() => setEventType('all')}>
              <X className="h-3 w-3 ml-1" />
            </button>
          </Badge>
        )}

        {category !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            <Filter className="h-3 w-3" />
            {CATEGORIES.find(c => c.id === category)?.name}
            <button onClick={() => setCategory('all')}>
              <X className="h-3 w-3 ml-1" />
            </button>
          </Badge>
        )}

        {city !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            <MapPin className="h-3 w-3" />
            {CITIES.find(c => c.id === city)?.name}
            <button onClick={() => setCity('all')}>
              <X className="h-3 w-3 ml-1" />
            </button>
          </Badge>
        )}

        {onlyFree && (
          <Badge variant="secondary" className="gap-1">
            <Ticket className="h-3 w-3" />
            Solo gratuitos
            <button onClick={() => setOnlyFree(false)}>
              <X className="h-3 w-3 ml-1" />
            </button>
          </Badge>
        )}

        {searchTerm && (
          <Badge variant="secondary" className="gap-1">
            <Search className="h-3 w-3" />
            "{searchTerm}"
            <button onClick={() => setSearchTerm('')}>
              <X className="h-3 w-3 ml-1" />
            </button>
          </Badge>
        )}
      </div>

      {/* Estado de carga */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-zinc-500">Cargando eventos...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-zinc-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-zinc-500 mb-4">No se encontraron eventos con los filtros seleccionados.</p>
          <Button onClick={handleResetFilters}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div>
          {/* Totales y ordenación */}
          <div className="mb-6">
            <p className="text-sm text-zinc-500">Mostrando {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'}</p>
          </div>

          {/* Listado de eventos */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                imageUrl={event.imageUrl}
                date={new Date(event.startDate)}
                endDate={event.endDate ? new Date(event.endDate) : null}
                location={event.location}
                city={event.city}
                price={event.price}
                categories={event.categories}
                attendeeCount={event._count.registrations}
                featured={false}
                status="UPCOMING"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
