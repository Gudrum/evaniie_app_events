import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('API: Fetching events...');

    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        eventType: true,
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: [
        {
          published: 'desc',
        },
        {
          startDate: 'asc',
        },
      ],
    });

    console.log(`API: Found ${events.length} events`);

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('API Error al obtener eventos:', error);
    return NextResponse.json(
      { error: 'Error al obtener eventos', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Verificar los datos mínimos requeridos
    if (!data.title || !data.description || !data.eventTypeId || !data.startDate || !data.location || !data.city) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos para crear el evento' },
        { status: 400 }
      );
    }

    // Extraer categorías para conectarlas
    const { categoryIds, ...eventData } = data;

    // Crear el evento en la base de datos
    const newEvent = await prisma.event.create({
      data: {
        ...eventData,
        // Por ahora usamos un organizador hardcodeado
        // En un sistema con autenticación, sería el usuario autenticado
        organizer: {
          connect: {
            email: 'admin@example.com', // Usar el admin por defecto
          },
        },
        eventType: {
          connect: {
            id: data.eventTypeId,
          },
        },
        categories: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
      },
      include: {
        categories: true,
        eventType: true,
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error al crear evento:', error);
    return NextResponse.json(
      { error: 'Error al crear el evento', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
