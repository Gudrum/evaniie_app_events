"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { EventForm } from "@/components/dashboard/EventForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EventFormEditorProps {
  eventId: string;
}

export default function EventFormEditor({ eventId }: EventFormEditorProps) {
  const router = useRouter();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${eventId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Evento no encontrado');
          }
          throw new Error(`Error al cargar el evento: ${response.status}`);
        }

        const data = await response.json();

        // Formatear los datos para el formulario
        const formattedEvent = {
          ...data.event,
          startDate: new Date(data.event.startDate),
          endDate: data.event.endDate ? new Date(data.event.endDate) : undefined,
          categoryIds: data.event.categories.map((cat: any) => cat.id),
        };

        setEvent(formattedEvent);
        setError(null);
      } catch (error) {
        console.error("Error al cargar el evento:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSuccess = () => {
    toast.success("Evento actualizado correctamente");
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-secondary h-10 w-10"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-secondary rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return <EventForm initialData={event} onSuccess={handleSuccess} />;
}
