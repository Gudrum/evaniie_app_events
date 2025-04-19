import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Obtener todas las inscripciones de un evento
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    // Obtener todas las inscripciones del evento
    const registrations = await prisma.registration.findMany({
      where: {
        eventId: eventId,
      },
      orderBy: [
        {
          status: 'asc', // CONFIRMED, PENDING, CANCELLED
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener las inscripciones' },
      { status: 500 }
    );
  }
}

// Crear una nueva inscripción a un evento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const data = await request.json();

    // Verificar que el evento existe y permite inscripciones
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    if (!event.allowRegistration) {
      return NextResponse.json(
        { error: 'Este evento no permite inscripciones' },
        { status: 400 }
      );
    }

    // Verificar que el evento no ha superado su capacidad
    if (event.capacity) {
      const registrationsCount = await prisma.registration.count({
        where: {
          eventId: eventId,
          status: {
            in: ['CONFIRMED', 'PENDING'],
          },
        },
      });

      if (registrationsCount >= event.capacity) {
        return NextResponse.json(
          { error: 'El evento ha alcanzado su capacidad máxima' },
          { status: 400 }
        );
      }
    }

    // Crear la inscripción
    const registration = await prisma.registration.create({
      data: {
        ...data,
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });

    return NextResponse.json(
      { registration, message: 'Inscripción creada con éxito' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear inscripción:', error);
    return NextResponse.json(
      { error: 'Error al procesar la inscripción' },
      { status: 500 }
    );
  }
}
