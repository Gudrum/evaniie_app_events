"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit, Eye, Trash2, Users, CalendarClock, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string | null;
  location: string;
  city: string;
  organizer: {
    name: string;
  };
  eventType: {
    id: string;
    name: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  published: boolean;
  allowRegistration: boolean;
  _count: {
    registrations: number;
  };
}

interface EventListProps {
  limit?: number;
  type?: string;
  upcoming?: boolean;
  publishedOnly?: boolean;
  refreshTrigger?: number;
  onViewParticipants?: (eventId: string, event: Event) => void;
}

export function EventList({
  limit,
  type,
  upcoming = false,
  publishedOnly = false,
  refreshTrigger = 0,
  onViewParticipants,
}: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteEvent, setDeleteEvent] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Cargar eventos desde la API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events");

        if (!response.ok) {
          throw new Error(`Error al cargar eventos: ${response.status}`);
        }

        const data = await response.json();
        let fetchedEvents = data.events || [];

        // Filtrar eventos según las props
        if (type) {
          fetchedEvents = fetchedEvents.filter((event: Event) => event.eventType.id === type);
        }

        if (upcoming) {
          fetchedEvents = fetchedEvents.filter((event: Event) =>
            new Date(event.startDate) >= new Date()
          );
        }

        if (publishedOnly) {
          fetchedEvents = fetchedEvents.filter((event: Event) => event.published);
        }

        // Limitar si es necesario
        if (limit && fetchedEvents.length > limit) {
          fetchedEvents = fetchedEvents.slice(0, limit);
        }

        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        toast.error("No se pudieron cargar los eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit, type, upcoming, publishedOnly, refreshTrigger]);

  // Función para cambiar el estado de publicación de un evento
  const handleTogglePublished = async (eventId: string, published: boolean) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el evento");
      }

      // Actualizar el estado local
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, published } : event
      ));

      toast.success(published ? "Evento publicado" : "Evento despublicado");
    } catch (error) {
      console.error("Error al cambiar estado de publicación:", error);
      toast.error("No se pudo actualizar el estado del evento");
    }
  };

  // Función para eliminar un evento
  const handleConfirmDelete = async () => {
    if (!deleteEvent) return;

    try {
      const response = await fetch(`/api/events/${deleteEvent}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el evento");
      }

      // Eliminar el evento de la lista
      setEvents(events.filter(event => event.id !== deleteEvent));
      toast.success("Evento eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      toast.error("No se pudo eliminar el evento");
    } finally {
      setDeleteEvent(null);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(index => (
          <div
            key={index}
            className="bg-muted animate-pulse rounded-lg h-24"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay eventos disponibles</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {events.map(event => (
          <Card key={event.id} className="overflow-hidden">
            <div className="sm:flex">
              <div
                className="h-32 sm:h-auto sm:w-32 bg-cover bg-center"
                style={{
                  backgroundImage: event.imageUrl
                    ? `url(${event.imageUrl})`
                    : `url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop)`,
                }}
              />
              <div className="p-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.eventType.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="text-xs bg-muted rounded-full px-2 py-1">
                      {format(new Date(event.startDate), "d MMM yyyy", { locale: es })}
                    </div>
                    {event.allowRegistration && (
                      <div className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full px-2 py-1">
                        Inscripciones
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm line-clamp-2 mb-3">{event.description}</p>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>{format(new Date(event.startDate), "EEEE d MMMM", { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.location}, {event.city}</span>
                  </div>
                  {event._count.registrations > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{event._count.registrations} inscritos</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link href={`/eventos/${event.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>Ver</span>
                      </Button>
                    </Link>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/edit/${event.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        <span>Editar</span>
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setDeleteEvent(event.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span>Eliminar</span>
                    </Button>

                    {onViewParticipants && event.allowRegistration && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewParticipants(event.id, event)}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        <span>Participantes</span>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="text-xs">
                      {event.published ? "Publicado" : "Borrador"}
                    </span>
                    <Switch
                      checked={event.published}
                      onCheckedChange={(checked) =>
                        handleTogglePublished(event.id, checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este evento
              y todas sus inscripciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
