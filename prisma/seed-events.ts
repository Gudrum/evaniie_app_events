import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Verificando categorías y tipos de eventos...');

    // Verificar que existan las categorías necesarias
    const musicaCategory = await prisma.category.findUnique({
      where: { name: 'Música' },
    });

    const arteCategory = await prisma.category.findUnique({
      where: { name: 'Arte' },
    });

    const gastronomiaCategory = await prisma.category.findUnique({
      where: { name: 'Gastronomía' },
    });

    const culturalCategory = await prisma.category.findUnique({
      where: { name: 'Cultural' },
    });

    // Verificar que existan los tipos de eventos
    const conciertoType = await prisma.eventType.findUnique({
      where: { id: 'concierto' },
    });

    const festivalType = await prisma.eventType.findUnique({
      where: { id: 'festival' },
    });

    const exposicionType = await prisma.eventType.findUnique({
      where: { id: 'exposicion' },
    });

    const gastronomiaType = await prisma.eventType.findUnique({
      where: { id: 'gastronomia' },
    });

    // Obtener usuario administrador
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!admin) {
      throw new Error('No se encontró un usuario administrador. Ejecuta primero seed-initial.ts');
    }

    // Limpiar eventos anteriores
    console.log('Eliminando registros anteriores...');
    await prisma.registration.deleteMany();
    await prisma.event.deleteMany();

    console.log('Creando eventos de ejemplo...');

    // 1. Festival Gastronómico
    const festivalGastronomico = await prisma.event.create({
      data: {
        title: 'Festival Gastronómico Internacional',
        description: 'Descubre sabores de todo el mundo en el festival gastronómico más esperado del año. Chefs reconocidos presentarán sus creaciones culinarias, talleres de cocina y degustaciones de platos emblemáticos de diferentes culturas.',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2874&auto=format&fit=crop',
        startDate: new Date(2025, 5, 15, 11, 0), // 15 de junio de 2025 a las 11:00
        endDate: new Date(2025, 5, 17, 22, 0), // 17 de junio de 2025 a las 22:00
        time: '11:00 - 22:00',
        location: 'Parque Central',
        address: 'Avenida Principal 123',
        city: 'Ciudad de México',
        price: 250,
        capacity: 5000,
        organizer: {
          connect: {
            id: admin.id,
          },
        },
        published: true,
        allowRegistration: true,
        categories: {
          connect: [
            { id: gastronomiaCategory?.id || '' },
            { id: culturalCategory?.id || '' },
          ],
        },
        eventType: {
          connect: {
            id: gastronomiaType?.id || 'gastronomia',
          },
        },
        contactEmail: 'festival@example.com',
        contactPhone: '+1234567890',
        additionalInfo: 'Trae tu propio recipiente para degustaciones y ayúdanos a reducir el uso de plásticos.',
      },
    });

    // 2. Concierto Sinfónica
    const conciertoSinfonica = await prisma.event.create({
      data: {
        title: 'Concierto Sinfónica Nacional: Noche de Clásicos',
        description: 'La Orquesta Sinfónica Nacional presenta una noche mágica dedicada a las obras maestras de Beethoven, Mozart y Tchaikovsky. Una velada inolvidable en el majestuoso Palacio de Bellas Artes con interpretaciones excepcionales de las piezas más emblemáticas de la música clásica.',
        imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=2940&auto=format&fit=crop',
        startDate: new Date(2025, 4, 25, 19, 30), // 25 de mayo de 2025 a las 19:30
        endDate: new Date(2025, 4, 25, 22, 0), // 25 de mayo de 2025 a las 22:00
        time: '19:30 - 22:00',
        location: 'Palacio de Bellas Artes',
        address: 'Av. Juárez y Eje Central',
        city: 'Ciudad de México',
        price: 500,
        capacity: 1800,
        organizer: {
          connect: {
            id: admin.id,
          },
        },
        published: true,
        allowRegistration: true,
        categories: {
          connect: [
            { id: musicaCategory?.id || '' },
            { id: culturalCategory?.id || '' },
          ],
        },
        eventType: {
          connect: {
            id: conciertoType?.id || 'concierto',
          },
        },
        contactEmail: 'concierto@example.com',
        contactPhone: '+1234567891',
      },
    });

    // 3. Exposición de Arte
    const exposicionArte = await prisma.event.create({
      data: {
        title: 'Exposición "Nuevas Perspectivas": Arte Contemporáneo',
        description: 'Una exhibición revolucionaria que reúne a los artistas contemporáneos más innovadores de Latinoamérica. Obras que desafían las percepciones tradicionales del arte a través de instalaciones inmersivas, arte digital y piezas experimentales que invitan a la reflexión sobre la sociedad actual.',
        imageUrl: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?q=80&w=2728&auto=format&fit=crop',
        startDate: new Date(2025, 3, 10, 10, 0), // 10 de abril de 2025 a las 10:00
        endDate: new Date(2025, 6, 30, 19, 0), // 30 de julio de 2025 a las 19:00
        time: '10:00 - 19:00',
        location: 'Museo de Arte Moderno',
        address: 'Paseo de la Reforma 51',
        city: 'Ciudad de México',
        price: 180,
        capacity: 800,
        organizer: {
          connect: {
            id: admin.id,
          },
        },
        published: true,
        allowRegistration: false,
        categories: {
          connect: [
            { id: arteCategory?.id || '' },
            { id: culturalCategory?.id || '' },
          ],
        },
        eventType: {
          connect: {
            id: exposicionType?.id || 'exposicion',
          },
        },
        contactEmail: 'exposicion@example.com',
      },
    });

    // 4. Festival de Danza Urbana
    const festivalDanza = await prisma.event.create({
      data: {
        title: 'Urban Battle: Competencia Internacional de Hip Hop',
        description: 'Los mejores bailarines de hip hop del mundo se reúnen en esta competición de alto nivel. Batallas uno a uno, exhibiciones de crews y workshops con maestros internacionales. Un evento imperdible para los amantes de la cultura urbana y la danza callejera.',
        imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2938&auto=format&fit=crop',
        startDate: new Date(2025, 7, 5, 16, 0), // 5 de agosto de 2025 a las 16:00
        endDate: new Date(2025, 7, 7, 23, 0), // 7 de agosto de 2025 a las 23:00
        time: '16:00 - 23:00',
        location: 'Arena Ciudad',
        address: 'Insurgentes Sur 4000',
        city: 'Ciudad de México',
        price: 350,
        capacity: 3000,
        organizer: {
          connect: {
            id: admin.id,
          },
        },
        published: true,
        allowRegistration: true,
        categories: {
          connect: [
            { id: musicaCategory?.id || '' },
            { id: culturalCategory?.id || '' },
          ],
        },
        eventType: {
          connect: {
            id: festivalType?.id || 'festival',
          },
        },
        contactEmail: 'urbanbattle@example.com',
        contactPhone: '+1234567892',
        additionalInfo: 'Los competidores deben registrarse con al menos una semana de anticipación.',
      },
    });

    // 5. Evento no publicado
    const eventoPrivado = await prisma.event.create({
      data: {
        title: 'Workshop de Graffiti: Técnicas y Expresión Urbana',
        description: 'Aprende las técnicas fundamentales del graffiti y el arte urbano con reconocidos artistas internacionales. Desde el uso de plantillas hasta el manejo de aerosoles y creación de murales, este taller práctico te dará las herramientas para desarrollar tu propio estilo dentro del arte callejero.',
        imageUrl: 'https://images.unsplash.com/photo-1607604760722-d98ceb350bb7?q=80&w=2940&auto=format&fit=crop',
        startDate: new Date(2025, 6, 12, 10, 0), // 12 de julio de 2025 a las 10:00
        endDate: new Date(2025, 6, 13, 18, 0), // 13 de julio de 2025 a las 18:00
        time: '10:00 - 18:00',
        location: 'Centro Cultural Universitario',
        address: 'Av. Universidad 3000',
        city: 'Ciudad de México',
        price: 150,
        capacity: 50,
        organizer: {
          connect: {
            id: admin.id,
          },
        },
        published: false, // No publicado
        allowRegistration: true,
        categories: {
          connect: [
            { id: arteCategory?.id || '' },
          ],
        },
        eventType: {
          connect: {
            id: festivalType?.id || 'festival',
          },
        },
        contactEmail: 'workshop@example.com',
      },
    });

    console.log('Eventos creados:', {
      festivalGastronomico: festivalGastronomico.id,
      conciertoSinfonica: conciertoSinfonica.id,
      exposicionArte: exposicionArte.id,
      festivalDanza: festivalDanza.id,
      eventoPrivado: eventoPrivado.id,
    });

    console.log('Creando algunas inscripciones de ejemplo...');

    // Obtener usuario normal para registrarlo en eventos
    const user = await prisma.user.findFirst({
      where: { role: 'USER' },
    });

    if (user) {
      // Registrar al usuario en algunos eventos
      await prisma.registration.create({
        data: {
          event: {
            connect: {
              id: festivalGastronomico.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
          status: 'CONFIRMED',
          name: user.name,
          email: user.email,
          phone: '+1234567899',
          city: 'Ciudad de México',
          notes: 'Me interesan los talleres de cocina internacional.',
        },
      });

      await prisma.registration.create({
        data: {
          event: {
            connect: {
              id: conciertoSinfonica.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
          status: 'PENDING',
          name: user.name,
          email: user.email,
          city: 'Ciudad de México',
        },
      });

      console.log('Inscripciones de ejemplo creadas.');
    }

    console.log('Seed de eventos completado exitosamente');
  } catch (error) {
    console.error('Error durante el seed de eventos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => console.log('Seed de eventos completado'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
