import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Actualizar el estado de una inscripción
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; registrationId: string } }
) {
  try {
    const { id: eventId, registrationId } = params;
    const data = await request.json();

    // Verificar que la solicitud contiene un estado válido
    if (!data.status || !['CONFIRMED', 'PENDING', 'CANCELLED'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Estado de inscripción no válido' },
        { status: 400 }
      );
    }

    // Verificar que la inscripción existe y pertenece al evento
    const registration = await prisma.registration.findFirst({
      where: {
        id: registrationId,
        eventId: eventId,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar el estado de la inscripción
    const updatedRegistration = await prisma.registration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: data.status,
      },
    });

    return NextResponse.json({
      registration: updatedRegistration,
      message: `Inscripción ${data.status === 'CONFIRMED' ? 'confirmada' : data.status === 'CANCELLED' ? 'cancelada' : 'actualizada'} con éxito`
    },
    { status: 200 });
  } catch (error) {
    console.error('Error al actualizar inscripción:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la inscripción' },
      { status: 500 }
    );
  }
}

// Eliminar una inscripción
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; registrationId: string } }
) {
  try {
    const { id: eventId, registrationId } = params;

    // Verificar que la inscripción existe y pertenece al evento
    const registration = await prisma.registration.findFirst({
      where: {
        id: registrationId,
        eventId: eventId,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar la inscripción
    await prisma.registration.delete({
      where: {
        id: registrationId,
      },
    });

    return NextResponse.json(
      { message: 'Inscripción eliminada con éxito' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar inscripción:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la inscripción' },
      { status: 500 }
    );
  }
}
