import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const body = await request.json();
    const { userId, email, name } = body;

    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'El evento no existe' },
        { status: 404 }
      );
    }

    // Si el evento está cancelado, no permitir registros
    if (event.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'El evento ha sido cancelado' },
        { status: 400 }
      );
    }

    // Verificar si hay capacidad disponible
    if (event.capacity !== null) {
      const attendeesCount = await prisma.attendee.count({
        where: {
          eventId,
        },
      });

      if (attendeesCount >= event.capacity) {
        return NextResponse.json(
          { error: 'El evento ha alcanzado su capacidad máxima' },
          { status: 400 }
        );
      }
    }

    let existingUser;

    // Si se proporciona un userId, usamos ese usuario
    if (userId) {
      existingUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }
    }
    // Si no hay userId pero sí hay email, buscamos por email o creamos uno nuevo
    else if (email) {
      existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser && name) {
        // Crear nuevo usuario si no existe
        existingUser = await prisma.user.create({
          data: {
            name,
            email,
            password: 'temporary-password', // En una aplicación real, se manejaría apropiadamente
            role: 'USER',
          },
        });
      } else if (!existingUser) {
        return NextResponse.json(
          { error: 'Se requiere el nombre para crear un nuevo usuario' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Se requiere userId o email' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya está registrado
    const existingAttendee = await prisma.attendee.findUnique({
      where: {
        userId_eventId: {
          userId: existingUser.id,
          eventId,
        },
      },
    });

    if (existingAttendee) {
      if (existingAttendee.status === 'CANCELLED') {
        // Si el usuario había cancelado, actualizamos su estado
        const attendee = await prisma.attendee.update({
          where: {
            id: existingAttendee.id,
          },
          data: {
            status: 'REGISTERED',
          },
        });

        return NextResponse.json({ attendee }, { status: 200 });
      }

      return NextResponse.json(
        { error: 'Ya estás registrado en este evento' },
        { status: 400 }
      );
    }

    // Crear nuevo asistente
    const attendee = await prisma.attendee.create({
      data: {
        user: {
          connect: {
            id: existingUser.id,
          },
        },
        event: {
          connect: {
            id: eventId,
          },
        },
        status: 'REGISTERED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ attendee }, { status: 201 });
  } catch (error) {
    console.error('Error al registrarse en el evento:', error);
    return NextResponse.json(
      { error: 'Error al procesar el registro' },
      { status: 500 }
    );
  }
}
