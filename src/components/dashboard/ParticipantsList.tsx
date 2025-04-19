"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, X, AlertCircle, User, MailIcon, PhoneIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  notes: string | null;
}

interface ParticipantsListProps {
  eventId: string;
  refreshTrigger?: number;
}

export function ParticipantsList({ eventId, refreshTrigger = 0 }: ParticipantsListProps) {
  const [participants, setParticipants] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${eventId}/registrations`);

        if (!response.ok) {
          throw new Error(`Error al cargar participantes: ${response.status}`);
        }

        const data = await response.json();
        setParticipants(data.registrations || []);
        setError(null);
      } catch (error) {
        console.error("Error al cargar participantes:", error);
        setError("No se pudieron cargar los participantes");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId, refreshTrigger]);

  const handleUpdateStatus = async (registrationId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      const response = await fetch(`/api/events/${eventId}/registrations/${registrationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado del participante");
      }

      // Actualizar el estado localmente
      setParticipants(
        participants.map((p) =>
          p.id === registrationId ? { ...p, status } : p
        )
      );

      toast.success(
        status === 'CONFIRMED'
          ? "Participante confirmado"
          : "Participante cancelado"
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("No se pudo actualizar el estado del participante");
    }
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

  if (participants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay participantes</CardTitle>
          <CardDescription>
            Aún no hay personas inscritas en este evento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Información</AlertTitle>
            <AlertDescription>
              Los participantes aparecerán aquí cuando se registren en el evento.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participantes inscritos ({participants.length})</CardTitle>
        <CardDescription>
          Gestiona las inscripciones al evento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Fecha de inscripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {participant.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <MailIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{participant.email}</span>
                      </div>
                      {participant.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <PhoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{participant.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(participant.createdAt), "d MMM yyyy HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        participant.status === 'CONFIRMED'
                          ? "default"
                          : participant.status === 'CANCELLED'
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {participant.status === 'CONFIRMED'
                        ? "Confirmado"
                        : participant.status === 'CANCELLED'
                        ? "Cancelado"
                        : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {participant.status !== 'CONFIRMED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleUpdateStatus(participant.id, 'CONFIRMED')
                          }
                        >
                          <span className="sr-only">Confirmar</span>
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {participant.status !== 'CANCELLED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleUpdateStatus(participant.id, 'CANCELLED')
                          }
                        >
                          <span className="sr-only">Cancelar</span>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
