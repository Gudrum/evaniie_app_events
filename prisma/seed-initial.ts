import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear tipos de eventos
    const eventTypes = [
      { id: 'concierto', name: 'Concierto' },
      { id: 'exposicion', name: 'Exposición de Arte' },
      { id: 'festival', name: 'Festival' },
      { id: 'teatro', name: 'Teatro' },
      { id: 'danza', name: 'Danza' },
      { id: 'taller', name: 'Taller' },
      { id: 'gastronomia', name: 'Gastronomía' },
      { id: 'cine', name: 'Cine' },
      { id: 'literatura', name: 'Literatura' },
      { id: 'otro', name: 'Otro' },
    ];

    console.log('Creando tipos de eventos...');

    for (const eventType of eventTypes) {
      await prisma.eventType.upsert({
        where: { id: eventType.id },
        update: { name: eventType.name },
        create: {
          id: eventType.id,
          name: eventType.name,
        },
      });
    }

    // Crear categorías
    const categories = [
      { name: 'Música' },
      { name: 'Arte' },
      { name: 'Gastronomía' },
      { name: 'Cultural' },
      { name: 'Educativo' },
      { name: 'Entretenimiento' },
      { name: 'Deportivo' },
      { name: 'Familiar' },
      { name: 'Tecnología' },
    ];

    console.log('Creando categorías...');

    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: { name: category.name },
      });
    }

    // Crear usuario administrador
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123', // En producción usar bcrypt para hashear
        role: 'ADMIN',
        bio: 'Administrador del sistema',
      },
    });

    console.log('Usuario admin creado:', admin);

    // Crear usuario normal
    const user = await prisma.user.upsert({
      where: { email: 'usuario@example.com' },
      update: {},
      create: {
        name: 'Usuario Ejemplo',
        email: 'usuario@example.com',
        password: 'password123', // En producción usar bcrypt para hashear
        role: 'USER',
        bio: 'Usuario de ejemplo',
      },
    });

    console.log('Usuario normal creado:', user);

    console.log('Datos iniciales creados exitosamente');
  } catch (error) {
    console.error('Error durante el sembrado inicial:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => console.log('Sembrado inicial completado'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
