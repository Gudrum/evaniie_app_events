import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventsExplorer from '@/components/EventsExplorer';

export const metadata: Metadata = {
  title: 'Explorar Eventos | Evaniie',
  description: 'Descubre y filtra eventos de todo tipo según tus preferencias',
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center mr-4">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Explorar Eventos</h1>
          </div>
          <div className="flex items-center">
            <Button className="rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90" asChild>
              <Link href="/dashboard">
                Gestionar Eventos
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Encuentra tu próximo evento</h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            Explora nuestra colección de eventos y filtra por categoría, precio, ubicación y más para encontrar exactamente lo que estás buscando.
          </p>
        </div>

        {/* Eventos con filtros */}
        <EventsExplorer />
      </main>
    </div>
  );
}
