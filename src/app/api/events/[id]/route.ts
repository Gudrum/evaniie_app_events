import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Obtener un evento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        categories: true,
        eventType: true,
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    return NextResponse.json(
      { error: 'Error al obtener el evento' },
      { status: 500 }
    );
  }
}

// Actualizar un evento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const data = await request.json();

    // Verificar que el evento existe
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    // Extraer categorías para conectarlas
    const { categoryIds, ...eventData } = data;

    // Actualizar el evento
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...eventData,
        eventType: {
          connect: {
            id: data.eventTypeId,
          },
        },
        categories: {
          // Desconectar todas las categorías existentes
          set: [],
          // Conectar las nuevas categorías
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

    return NextResponse.json({ event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el evento' },
      { status: 500 }
    );
  }
}

// Eliminar un evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    // Verificar que el evento existe
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el evento
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    return NextResponse.json(
      { message: 'Evento eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el evento' },
      { status: 500 }
    );
  }
}
