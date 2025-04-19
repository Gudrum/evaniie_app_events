import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Limpiar la base de datos
    await prisma.$transaction([
      prisma.comment.deleteMany(),
      prisma.post.deleteMany(),
      prisma.category.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    console.log('Base de datos limpiada');

    // Crear categorías
    const categorias = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Tecnología',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Desarrollo Web',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Base de Datos',
        },
      }),
    ]);

    console.log('Categorías creadas:', categorias);

    // Crear usuario administrador
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123', // En producción usar bcrypt para hashear
        role: 'ADMIN',
        bio: 'Administrador del sistema',
      },
    });

    console.log('Usuario admin creado:', admin);

    // Crear usuario normal
    const user = await prisma.user.create({
      data: {
        name: 'Usuario Ejemplo',
        email: 'usuario@example.com',
        password: 'password123', // En producción usar bcrypt para hashear
        role: 'USER',
        bio: 'Usuario de ejemplo',
      },
    });

    console.log('Usuario normal creado:', user);

    // Crear posts
    const post1 = await prisma.post.create({
      data: {
        title: 'Introducción a Prisma con PostgreSQL',
        content: 'Prisma es un ORM moderno para Node.js y TypeScript que facilita el acceso a bases de datos...',
        published: true,
        authorId: admin.id,
        categories: {
          connect: [
            { id: categorias[1].id }, // Desarrollo Web
            { id: categorias[2].id }, // Base de Datos
          ],
        },
      },
    });

    const post2 = await prisma.post.create({
      data: {
        title: 'Ventajas de PostgreSQL v17',
        content: 'PostgreSQL 17 trae importantes mejoras en rendimiento y nuevas características como...',
        published: true,
        authorId: admin.id,
        categories: {
          connect: [
            { id: categorias[0].id }, // Tecnología
            { id: categorias[2].id }, // Base de Datos
          ],
        },
      },
    });

    console.log('Posts creados:', [post1, post2]);

    // Crear comentarios
    const comentarios = await Promise.all([
      prisma.comment.create({
        data: {
          content: '¡Excelente artículo! Me ha sido muy útil para entender Prisma.',
          postId: post1.id,
          authorId: user.id,
        },
      }),
      prisma.comment.create({
        data: {
          content: 'PostgreSQL sigue mejorando con cada versión. Muy buena información.',
          postId: post2.id,
          authorId: user.id,
        },
      }),
    ]);

    console.log('Comentarios creados:', comentarios);

    console.log('Seed completado exitosamente');
  } catch (error) {
    console.error('Error durante el seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => console.log('Seed completado'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
