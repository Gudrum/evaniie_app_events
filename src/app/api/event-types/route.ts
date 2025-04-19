import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const eventTypes = await prisma.eventType.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ eventTypes });
  } catch (error) {
    console.error('Error al obtener tipos de eventos:', error);
    return NextResponse.json(
      { error: 'Error al obtener tipos de eventos' },
      { status: 500 }
    );
  }
}
