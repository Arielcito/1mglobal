import { PrismaClient, CourseStatus, ClassStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario administrador de prueba
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      username: 'adminuser',
      is_admin: true,
    },
  })

  // Crear categorías
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Trading',
        description: 'Cursos relacionados con trading y mercados financieros'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Network Marketing',
        description: 'Cursos sobre marketing multinivel y ventas'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Marketing Digital',
        description: 'Cursos sobre marketing en redes sociales'
      }
    })
  ])

  // Crear cursos
  const tradingCourse = await prisma.course.create({
    data: {
      title: 'Trading Profesional',
      description: 'Domina el arte del trading desde cero hasta nivel avanzado',
      image_url: '/images/courses/trading.jpg',
      price: 299.99,
      status: 'PUBLISHED',
      instructor_id: admin.id,
      category_id: categories[0].id,
      published_at: new Date(),
      classes: {
        create: [
          {
            title: 'Introducción al Trading',
            description: 'Conceptos básicos y fundamentos del trading',
            content: 'Contenido detallado de la clase...',
            duration: 60,
            order: 1,
            status: 'PUBLISHED',
            published_at: new Date(),
          },
          {
            title: 'Análisis Técnico Básico',
            description: 'Aprende a leer gráficos y patrones básicos',
            content: 'Contenido detallado de la clase...',
            duration: 90,
            order: 2,
            status: 'PUBLISHED',
            published_at: new Date(),
          },
          {
            title: 'Gestión del Riesgo',
            description: 'Estrategias para proteger tu capital',
            content: 'Contenido detallado de la clase...',
            duration: 75,
            order: 3,
            status: 'PUBLISHED',
            published_at: new Date(),
          }
        ]
      }
    }
  })

  const networkMarketingCourse = await prisma.course.create({
    data: {
      title: 'Network Marketing Masterclass',
      description: 'Aprende a construir una red de ventas exitosa',
      image_url: '/images/courses/network.jpg',
      price: 199.99,
      status: 'PUBLISHED',
      instructor_id: admin.id,
      category_id: categories[1].id,
      published_at: new Date(),
      classes: {
        create: [
          {
            title: 'Fundamentos del Network Marketing',
            description: 'Bases y principios del marketing multinivel',
            content: 'Contenido detallado de la clase...',
            duration: 45,
            order: 1,
            status: 'PUBLISHED',
            published_at: new Date(),
          },
          {
            title: 'Construcción de Equipos',
            description: 'Estrategias para reclutar y mantener equipos',
            content: 'Contenido detallado de la clase...',
            duration: 60,
            order: 2,
            status: 'PUBLISHED',
            published_at: new Date(),
          }
        ]
      }
    }
  })

  const socialMediaCourse = await prisma.course.create({
    data: {
      title: 'Domina las Redes Sociales',
      description: 'Estrategias avanzadas para redes sociales',
      image_url: '/images/courses/social.jpg',
      price: 149.99,
      status: 'PUBLISHED',
      instructor_id: admin.id,
      category_id: categories[2].id,
      published_at: new Date(),
      classes: {
        create: [
          {
            title: 'Estrategia en Instagram',
            description: 'Maximiza tu presencia en Instagram',
            content: 'Contenido detallado de la clase...',
            duration: 55,
            order: 1,
            status: 'PUBLISHED',
            published_at: new Date(),
          },
          {
            title: 'Marketing en TikTok',
            description: 'Crea contenido viral en TikTok',
            content: 'Contenido detallado de la clase...',
            duration: 65,
            order: 2,
            status: 'PUBLISHED',
            published_at: new Date(),
          },
          {
            title: 'Monetización en Redes',
            description: 'Aprende a monetizar tu audiencia',
            content: 'Contenido detallado de la clase...',
            duration: 70,
            order: 3,
            status: 'PUBLISHED',
            published_at: new Date(),
          }
        ]
      }
    }
  })

  console.log({ admin, categories, tradingCourse, networkMarketingCourse, socialMediaCourse })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 