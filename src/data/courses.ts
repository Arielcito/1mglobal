export const MOCK_COURSES = [
  {
    course_id: 1,
    title: "Trading Profesional",
    description: "Domina el arte del trading desde cero hasta nivel avanzado. Aprenderás análisis técnico, gestión de riesgo y psicología del trading.",
    image_url: "/images/courses/trading.jpg",
    price: 299.99,
    status: "PUBLISHED",
    category: {
      id: 1,
      name: "Trading",
      description: "Cursos relacionados con trading y mercados financieros"
    },
    classes: [
      {
        class_id: 1,
        title: "Introducción al Trading",
        description: "Conceptos básicos y fundamentos del trading",
        duration: 60,
        order: 1,
        status: "PUBLISHED",
        content: "En esta clase aprenderás los conceptos fundamentales del trading...",
        resources: [
          {
            id: 1,
            title: "Guía de Trading Básico",
            type: "PDF",
            url: "/resources/trading-basics.pdf"
          }
        ]
      },
      {
        class_id: 2,
        title: "Análisis Técnico Básico",
        description: "Aprende a leer gráficos y patrones básicos",
        duration: 90,
        order: 2,
        status: "PUBLISHED",
        content: "Descubre cómo interpretar los gráficos y patrones más comunes...",
        resources: [
          {
            id: 2,
            title: "Plantilla de Análisis Técnico",
            type: "EXCEL",
            url: "/resources/technical-analysis.xlsx"
          }
        ]
      },
      {
        class_id: 3,
        title: "Gestión del Riesgo",
        description: "Estrategias para proteger tu capital",
        duration: 75,
        order: 3,
        status: "PUBLISHED",
        content: "La gestión del riesgo es fundamental para el éxito en trading...",
        resources: [
          {
            id: 3,
            title: "Calculadora de Riesgo",
            type: "EXCEL",
            url: "/resources/risk-calculator.xlsx"
          }
        ]
      }
    ]
  },
  {
    course_id: 2,
    title: "Network Marketing Masterclass",
    description: "Aprende a construir una red de ventas exitosa y desarrolla habilidades de liderazgo en el network marketing.",
    image_url: "/images/courses/network.jpg",
    price: 199.99,
    status: "PUBLISHED",
    category: {
      id: 2,
      name: "Network Marketing",
      description: "Cursos sobre marketing multinivel y ventas"
    },
    classes: [
      {
        class_id: 4,
        title: "Fundamentos del Network Marketing",
        description: "Bases y principios del marketing multinivel",
        duration: 45,
        order: 1,
        status: "PUBLISHED",
        content: "Descubre los principios fundamentales del network marketing...",
        resources: [
          {
            id: 4,
            title: "Guía de Inicio Rápido",
            type: "PDF",
            url: "/resources/network-basics.pdf"
          }
        ]
      },
      {
        class_id: 5,
        title: "Construcción de Equipos",
        description: "Estrategias para reclutar y mantener equipos",
        duration: 60,
        order: 2,
        status: "PUBLISHED",
        content: "Aprende a construir y liderar equipos efectivos...",
        resources: [
          {
            id: 5,
            title: "Plan de Acción",
            type: "PDF",
            url: "/resources/team-building.pdf"
          }
        ]
      }
    ]
  },
  {
    course_id: 3,
    title: "Domina las Redes Sociales",
    description: "Estrategias avanzadas para crear contenido viral y monetizar tu presencia en redes sociales.",
    image_url: "/images/courses/social.jpg",
    price: 149.99,
    status: "PUBLISHED",
    category: {
      id: 3,
      name: "Marketing Digital",
      description: "Cursos sobre marketing en redes sociales"
    },
    classes: [
      {
        class_id: 6,
        title: "Estrategia en Instagram",
        description: "Maximiza tu presencia en Instagram",
        duration: 55,
        order: 1,
        status: "PUBLISHED",
        content: "Aprende a crear una estrategia efectiva en Instagram...",
        resources: [
          {
            id: 6,
            title: "Calendario de Contenidos",
            type: "PDF",
            url: "/resources/instagram-calendar.pdf"
          }
        ]
      },
      {
        class_id: 7,
        title: "Marketing en TikTok",
        description: "Crea contenido viral en TikTok",
        duration: 65,
        order: 2,
        status: "PUBLISHED",
        content: "Descubre las claves para crear contenido viral en TikTok...",
        resources: [
          {
            id: 7,
            title: "Guía de TikTok",
            type: "PDF",
            url: "/resources/tiktok-guide.pdf"
          }
        ]
      },
      {
        class_id: 8,
        title: "Monetización en Redes",
        description: "Aprende a monetizar tu audiencia",
        duration: 70,
        order: 3,
        status: "PUBLISHED",
        content: "Estrategias efectivas para monetizar tu presencia en redes...",
        resources: [
          {
            id: 8,
            title: "Plan de Monetización",
            type: "PDF",
            url: "/resources/monetization-plan.pdf"
          }
        ]
      }
    ]
  }
]; 