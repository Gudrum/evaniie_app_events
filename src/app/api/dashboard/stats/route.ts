import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Obtener el total de eventos
    const totalEvents = await prisma.event.count();

    // Obtener el total de eventos publicados
    const publishedEvents = await prisma.event.count({
      where: {
        published: true,
      },
    });

    // Obtener la categoría más popular
    // Primero obtenemos el conteo de eventos por categoría
    const categoryCounts = await prisma.$queryRaw<{ name: string, count: number }[]>`
      SELECT c.name, COUNT(e.id) as count
      FROM "Category" c
      JOIN "_CategoryToEvent" ce ON c.id = ce."A"
      JOIN "Event" e ON ce."B" = e.id
      GROUP BY c.name
      ORDER BY count DESC
      LIMIT 1
    `;

    const popularCategory = categoryCounts.length > 0 ? categoryCounts[0].name : null;

    return NextResponse.json({
      totalEvents,
      publishedEvents,
      popularCategory,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener estadísticas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
