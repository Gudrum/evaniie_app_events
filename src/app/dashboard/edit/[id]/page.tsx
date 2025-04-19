import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EventFormEditor from "@/components/dashboard/EventFormEditor";

export const metadata = {
  title: "Editar Evento | Dashboard",
  description: "Modifica los detalles de un evento existente",
};

export default function EditEventPage({ params }: { params: { id: string } }) {
  const eventId = params.id;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/dashboard" className="flex items-center mr-4">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Volver al dashboard</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Editar Evento</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto pt-8 pb-10 px-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Editar Evento</CardTitle>
            <CardDescription>
              Actualiza la información del evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
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
            }>
              <EventFormEditor eventId={eventId} />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
