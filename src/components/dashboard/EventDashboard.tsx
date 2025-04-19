"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventForm } from "@/components/dashboard/EventForm";
import { EventList } from "@/components/dashboard/EventList";
import { ParticipantsList } from "@/components/dashboard/ParticipantsList";
import { ChevronLeft } from 'lucide-react';

export default function EventDashboard() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabParam || "overview");
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    popularCategory: '',
  });
  const [eventsRefreshTrigger, setEventsRefreshTrigger] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Función para obtener estadísticas
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    }
  };

  // Cargar estadísticas al iniciar
  useEffect(() => {
    fetchStats();
  }, [eventsRefreshTrigger]);

  // Efecto para actualizar la pestaña cuando cambia el parámetro de URL
  useEffect(() => {
    if (tabParam && ['overview', 'events', 'create', 'participants'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Función para cambiar a la pestaña de creación de eventos
  const handleNewEvent = () => {
    setActiveTab("create");
  };

  // Función para manejar creación exitosa de evento
  const handleEventCreated = () => {
    // Actualizar estadísticas y refrescar listas
    setEventsRefreshTrigger(prev => prev + 1);

    // Navegar a la pestaña de eventos
    setActiveTab("events");
  };

  // Función para ver los participantes de un evento
  const handleViewParticipants = (eventId: string, event: any) => {
    setSelectedEvent(event);
    setSelectedEventId(eventId);
    setActiveTab("participants");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center mr-4">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Dashboard de Eventos</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleNewEvent}>
              Crear Evento
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto pt-8 pb-10 px-4 sm:px-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg">
              Eventos
            </TabsTrigger>
            <TabsTrigger value="create" className="rounded-lg">
              Crear Evento
            </TabsTrigger>
            {selectedEvent && (
              <TabsTrigger value="participants" className="rounded-lg">
                Participantes
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Eventos</CardTitle>
                  <CardDescription>Todos los eventos creados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalEvents}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Eventos Publicados</CardTitle>
                  <CardDescription>Eventos visibles en el inicio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.publishedEvents}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Categoría Popular</CardTitle>
                  <CardDescription>Con más eventos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.popularCategory || "Ninguna"}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Eventos Recientes</CardTitle>
                <CardDescription>Los últimos eventos creados</CardDescription>
              </CardHeader>
              <CardContent>
                <EventList
                  limit={5}
                  refreshTrigger={eventsRefreshTrigger}
                  onViewParticipants={handleViewParticipants}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Eventos</CardTitle>
                <CardDescription>Lista completa de eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <EventList
                  refreshTrigger={eventsRefreshTrigger}
                  onViewParticipants={handleViewParticipants}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crear Nuevo Evento</CardTitle>
                <CardDescription>
                  Completa el formulario para crear un nuevo evento cultural
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventForm onSuccess={handleEventCreated} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedEvent.title}</h2>
                    <p className="text-muted-foreground">
                      Gestiona los participantes inscritos en este evento
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("events")}
                  >
                    Volver a Eventos
                  </Button>
                </div>
                <ParticipantsList
                  eventId={selectedEventId!}
                  refreshTrigger={eventsRefreshTrigger}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
