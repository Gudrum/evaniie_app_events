'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, differenceInDays, isBefore, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ChevronLeft,
  Share2,
  Heart,
  CalendarCheck,
  User,
  Mail,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from '@/lib/utils';

// Esquema de validación para el formulario de registro
const registerFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  notes: z.string().optional(),
});

// Tipos
type Attendee = {
  id: string;
  userId: string;
  eventId: string;
  status: 'REGISTERED' | 'ATTENDED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};

type EventDetailProps = {
  event: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    date: Date;
    endDate: Date | null;
    location: string;
    address: string;
    city: string;
    price: number | null;
    capacity: number | null;
    organizer: {
      id: string;
      name: string;
      image: string | null;
      bio: string | null;
    };
    categories: {
      id: string;
      name: string;
    }[];
    attendees: Attendee[];
    _count: {
      attendees: number;
    };
    featured: boolean;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    createdAt: Date;
    updatedAt: Date;
  };
  isExampleMode?: boolean;
};

export function EventDetail({ event, isExampleMode = false }: EventDetailProps) {
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Configurar el formulario
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      setIsRegistering(true);

      // Si estamos en modo ejemplo, simular registro exitoso
      if (isExampleMode) {
        // Simular un pequeño retraso
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsRegistered(true);
        setOpenDialog(false);

        toast({
          title: "¡Registro exitoso! (Modo demo)",
          description: "Te has registrado correctamente en el evento de demostración.",
        });

        return;
      }

      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse en el evento');
      }

      setIsRegistered(true);
      setOpenDialog(false);

      toast({
        title: "¡Registro exitoso!",
        description: "Te has registrado correctamente en el evento.",
      });

    } catch (error) {
      console.error('Error al registrarse:', error);
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al procesar tu registro",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // Verificar si el evento ya pasó
  const isPast = isBefore(new Date(event.date), new Date()) && !isSameDay(new Date(event.date), new Date());
  const isToday = isSameDay(new Date(event.date), new Date());

  // Calcular días restantes
  const daysRemaining = differenceInDays(new Date(event.date), new Date());

  // Determinar duración del evento
  let duration = 'Un día';
  if (event.endDate) {
    const days = differenceInDays(new Date(event.endDate), new Date(event.date)) + 1;
    duration = days > 1 ? `${days} días` : 'Un día';
  }

  return (
    <>
      <Toaster />

      {isExampleMode && (
        <div className="sticky top-16 z-30 bg-yellow-50 dark:bg-yellow-950/40 border-b border-yellow-200 dark:border-yellow-900/50 py-2">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="h-4 w-4 inline-block mr-1 mb-0.5" />
              Estás viendo un evento de demostración. El registro no se procesará en la base de datos.
            </p>
          </div>
        </div>
      )}

      {/* Navegación superior */}
      <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <span className="text-lg font-medium ml-2 line-clamp-1">
                {event.title}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-8">
            {/* Imagen del evento y estado */}
            <div className="relative rounded-3xl overflow-hidden">
              <div className="aspect-[16/9] relative">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900" />
                )}

                {event.status === 'CANCELLED' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge className="text-xl py-2 px-4 bg-red-500 text-white border-0">
                      Cancelado
                    </Badge>
                  </div>
                )}

                {event.featured && event.status !== 'CANCELLED' && (
                  <Badge className="absolute top-4 left-4 z-10 bg-primary/80 hover:bg-primary/90 backdrop-blur text-white border-0">
                    Destacado
                  </Badge>
                )}
              </div>
            </div>

            {/* Título y descripción */}
            <div>
              <h1 className="text-3xl font-medium tracking-tight mb-4">{event.title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {event.categories.map((category) => (
                  <Badge key={category.id} variant="outline" className="bg-zinc-100 dark:bg-zinc-800">
                    {category.name}
                  </Badge>
                ))}
              </div>

              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Organizador */}
            <div>
              <h2 className="text-xl font-medium mb-4">Organizador</h2>
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={event.organizer.image || undefined} alt={event.organizer.name} />
                    <AvatarFallback>
                      {event.organizer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{event.organizer.name}</p>
                    {event.organizer.bio && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{event.organizer.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Participantes */}
            {event.attendees.length > 0 && (
              <div>
                <h2 className="text-xl font-medium mb-4">Participantes ({event._count.attendees})</h2>
                <div className="flex -space-x-2 overflow-hidden">
                  {event.attendees.slice(0, 5).map((attendee) => (
                    <Avatar key={attendee.id} className="h-10 w-10 border-2 border-white dark:border-zinc-950">
                      <AvatarImage src={attendee.user.image || undefined} alt={attendee.user.name} />
                      <AvatarFallback>
                        {attendee.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}

                  {event._count.attendees > 5 && (
                    <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800">
                      <AvatarFallback>+{event._count.attendees - 5}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Sidebar */}
          <div className="space-y-8">
            {/* Tarjeta de resumen y registro */}
            <Card className="sticky top-24 overflow-hidden rounded-3xl border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-0">
                <div className="p-6 space-y-6">
                  {/* Fecha y hora */}
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Fecha y hora</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {format(new Date(event.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                      <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{format(new Date(event.date), "HH:mm", { locale: es })}</span>
                        {event.endDate && (
                          <>
                            <span className="mx-1">-</span>
                            <span>{format(new Date(event.endDate), "HH:mm", { locale: es })}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Duración: {duration}
                      </p>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Ubicación</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {event.location}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {event.address}, {event.city}
                      </p>
                    </div>
                  </div>

                  {/* Capacidad */}
                  {event.capacity && (
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Capacidad</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {event._count.attendees} / {event.capacity} asistentes
                        </p>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (event._count.attendees / event.capacity) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Precio */}
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Precio</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {event.price ? `$${event.price.toFixed(2)}` : 'Gratis'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botón de registro */}
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                  {isPast ? (
                    <Button
                      disabled
                      className="w-full rounded-full bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 cursor-not-allowed"
                    >
                      Evento finalizado
                    </Button>
                  ) : event.status === 'CANCELLED' ? (
                    <Button
                      disabled
                      className="w-full rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300 cursor-not-allowed"
                    >
                      Evento cancelado
                    </Button>
                  ) : isRegistered ? (
                    <Button
                      className="w-full rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
                      disabled
                    >
                      <CalendarCheck className="h-4 w-4 mr-2" />
                      Estás registrado
                    </Button>
                  ) : (
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                        >
                          {isToday ? '¡Regístrate hoy!' : 'Registrarme'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Registro para el evento</DialogTitle>
                          <DialogDescription>
                            Completa tus datos para registrarte en "{event.title}"
                          </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre completo</FormLabel>
                                  <FormControl>
                                    <div className="flex border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary">
                                      <div className="bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center px-3">
                                        <User className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                      </div>
                                      <Input className="border-0 focus-visible:ring-0" placeholder="Tu nombre" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <div className="flex border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary">
                                      <div className="bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center px-3">
                                        <Mail className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                      </div>
                                      <Input className="border-0 focus-visible:ring-0" placeholder="tu@email.com" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Notas (opcional)</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="¿Algo que necesites que sepamos?"
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Si tienes algún requerimiento especial o comentario.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <DialogFooter className="mt-6">
                              <Button
                                type="submit"
                                className={cn(
                                  "rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 w-full",
                                  isRegistering && "opacity-70 cursor-not-allowed"
                                )}
                                disabled={isRegistering}
                              >
                                {isRegistering ? (
                                  <>
                                    <span className="animate-spin mr-2">
                                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                          fill="none"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                      </svg>
                                    </span>
                                    Procesando...
                                  </>
                                ) : event.price ? (
                                  `Registrarme - $${event.price.toFixed(2)}`
                                ) : (
                                  'Registrarme - Gratis'
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Estado del evento */}
                  {!isPast && event.status !== 'CANCELLED' && !isRegistered && (
                    <div className="mt-4 text-center">
                      {daysRemaining > 0 ? (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Faltan <span className="font-semibold text-primary">{daysRemaining} días</span> para este evento
                        </p>
                      ) : isToday ? (
                        <motion.p
                          className="text-sm font-semibold text-primary"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          ¡El evento es hoy!
                        </motion.p>
                      ) : (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          La inscripción aún está abierta
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
