import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { EventsDataComponent } from "@/components/EventsDataComponent";
import { CalendarDays, MapPin, Search, TicketIcon, Clock, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center"
            style={{
              filter: 'saturate(0.8) brightness(0.7)',
            }}
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
              Descubre los mejores
              <span className="block text-primary">eventos con Evaniie.</span>
            </h1>
            <p className="text-zinc-200 text-lg sm:text-xl mb-8 max-w-2xl">
              Desde conciertos y exposiciones hasta talleres y conferencias.
              Organiza, gestiona y participa en eventos fascinantes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-white text-black hover:bg-white/90 rounded-full text-sm px-6 h-12"
                size="lg"
                asChild
              >
                <Link href="/eventos">
                  <Search className="h-4 w-4 mr-2" />
                  Explorar eventos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <header className="w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-lg font-semibold tracking-tight">Evaniie</span>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link href="/eventos" className="text-sm font-medium hover:text-primary transition-colors">
                Eventos
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>

            <div className="flex items-center">
              <Button className="rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90" asChild>
                <Link href="/dashboard">
                  Gestionar Eventos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Why Evaniie Section */}
      <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">¿Por qué usar Evaniie?</h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Plataforma integral para la gestión de eventos, desde la creación hasta la gestión de asistentes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Fácil de Usar</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Interfaz intuitiva que permite crear y gestionar eventos en minutos, sin complicaciones técnicas.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Gestión de Participantes</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Controla las inscripciones, confirma asistentes y comunícate con los participantes fácilmente.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <TicketIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Publicación Instantánea</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Publica tus eventos para que sean visibles inmediatamente y alcanza a más participantes.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-medium mb-8">Categorías para explorar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard
            name="Conciertos"
            icon={<CalendarDays className="h-6 w-6" />}
            color="bg-blue-500"
          />
          <CategoryCard
            name="Arte"
            icon={<CalendarDays className="h-6 w-6" />}
            color="bg-purple-500"
          />
          <CategoryCard
            name="Gastronomía"
            icon={<CalendarDays className="h-6 w-6" />}
            color="bg-amber-500"
          />
          <CategoryCard
            name="Danza"
            icon={<CalendarDays className="h-6 w-6" />}
            color="bg-pink-500"
          />
        </div>
      </section>

      {/* Main Events Section */}
      <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-medium">Eventos disponibles</h2>
          <Button variant="outline" className="gap-2 rounded-full" asChild>
            <Link href="/eventos">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <EventsDataComponent />
      </section>

      {/* Location Section */}
      <section className="py-16 bg-zinc-100 dark:bg-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-medium mb-6">Eventos en tu ciudad</h2>
              <p className="text-zinc-600 dark:text-zinc-300 mb-8">
                Descubre los mejores eventos cerca de ti. Desde conciertos
                hasta exposiciones, siempre tendrás algo que hacer en tu ciudad.
              </p>
              <div className="flex items-center text-zinc-700 dark:text-zinc-300 text-sm">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span className="text-base">Ciudad de México</span>
              </div>
              <Button className="mt-6 rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                Cambiar ubicación
              </Button>
            </div>
            <div className="aspect-video rounded-3xl overflow-hidden shadow-xl">
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1517214652678-5cb9bcd081f0?q=80&w=1810&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Evaniie</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                La plataforma para conectar a las personas con eventos emocionantes y gestionar la organización de forma sencilla.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Eventos</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>Destacados</li>
                <li>Próximos</li>
                <li>Cerca de ti</li>
                <li>Gratuitos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Categorías</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>Música</li>
                <li>Arte</li>
                <li>Gastronomía</li>
                <li>Danza</li>
                <li>Arte Urbano</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Contacto</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>Soporte</li>
                <li>Términos y Condiciones</li>
                <li>Privacidad</li>
                <li>API</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              © 2025 Evaniie. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="#" className="text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary">
                Instagram
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary">
                Twitter
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary">
                Facebook
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CategoryCard({ name, icon, color }: { name: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square relative rounded-3xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800">
        <div className={`absolute inset-0 ${color} opacity-15 group-hover:opacity-20 transition-opacity`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${color} text-white p-4 rounded-2xl`}>
            {icon}
          </div>
        </div>
      </div>
      <h3 className="text-center font-medium">{name}</h3>
    </div>
  );
}
