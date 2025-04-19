'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, MapPinIcon, TicketIcon, UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  date: Date;
  endDate?: Date | null;
  location: string;
  city: string;
  price?: number | null;
  capacity?: number | null;
  categories: {
    id: string;
    name: string;
  }[];
  attendeeCount: number;
  featured: boolean;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

export function EventCard({
  id,
  title,
  description,
  imageUrl,
  date,
  endDate,
  location,
  city,
  price,
  categories,
  attendeeCount,
  featured,
  status,
}: EventCardProps) {
  const isPast = new Date() > date;
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <div className={cn(
      "group relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full",
      featured && "ring-1 ring-primary/20"
    )}>
      <Link href={`/eventos/${id}`} className="absolute inset-0 z-10">
        <span className="sr-only">Ver detalles de {title}</span>
      </Link>

      <div className="aspect-[4/3] w-full overflow-hidden">
        <div className="h-full w-full relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900" />
          )}

          {featured && (
            <Badge className="absolute top-3 left-3 z-20 bg-primary/80 hover:bg-primary/90 backdrop-blur text-white border-0">
              Destacado
            </Badge>
          )}

          {status === 'CANCELLED' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
              <Badge className="text-lg py-1 px-3 bg-red-500 text-white border-0">
                Cancelado
              </Badge>
            </div>
          )}

          {status !== 'CANCELLED' && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 z-20">
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <Badge key={category.id} variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow p-4 md:p-5">
        <div className="mb-3">
          <h3 className="font-medium text-xl tracking-tight line-clamp-2">{title}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 line-clamp-2">{description}</p>
        </div>

        <div className="mt-auto space-y-3 pt-3">
          <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {format(date, "EEEE d 'de' MMMM, HH:mm", { locale: es })}
            </span>
          </div>

          <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{location}, {city}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
              <UserIcon className="h-4 w-4 mr-2" />
              <span>{attendeeCount} asistentes</span>
            </div>

            {price !== null && price !== undefined && (
              <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
                <TicketIcon className="h-4 w-4 mr-2" />
                <span>{price === 0 ? 'Gratis' : `$${price.toFixed(2)}`}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 md:p-5 md:pt-0">
        <Button
          className="w-full rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 relative z-20"
          disabled={isPast || status === 'CANCELLED'}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `/eventos/${id}`;
          }}
        >
          {isPast
            ? 'Evento finalizado'
            : status === 'CANCELLED'
              ? 'Cancelado'
              : isToday
                ? '¡Hoy! Ver detalles'
                : 'Ver detalles'}
        </Button>
      </div>
    </div>
  );
}
