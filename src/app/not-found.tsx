import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CalendarX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CalendarX className="h-10 w-10 text-zinc-500 dark:text-zinc-400" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>

        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido trasladada a otra ubicación.
        </p>

        <Button asChild className="rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
          <Link href="/">
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
