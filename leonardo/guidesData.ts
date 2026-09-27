export type Guide = {
  path: string; title: string; description: string; h1: string; lede: string;
  sections: { heading: string; paragraphs: string[] }[];
  faq: { question: string; answer: string }[];
};

export const POWER_BI_COST_GUIDE: Guide = {
  path: '/guias/cuanto-cuesta-dashboard-power-bi-guatemala/',
  title: 'Cuánto cuesta un dashboard Power BI | Sagepoint',
  description: 'Conoce qué cambia el costo de un dashboard Power BI en Guatemala, compara los paquetes publicados de Sagepoint y prepara una cotización clara.',
  h1: '¿Cuánto cuesta un dashboard de Power BI en Guatemala?',
  lede: 'La respuesta depende del trabajo que hay detrás de la pantalla. Dos dashboards con el mismo número de gráficos pueden requerir esfuerzos muy distintos si uno recibe datos ordenados y el otro debe reconciliar sistemas, limpiar registros y definir indicadores. Esta guía te ayuda a comparar alcances y a pedir una cotización que puedas evaluar.',
  sections: [
    {
      heading: 'Primero define la decisión que debe facilitar',
      paragraphs: [
        'Antes de contar gráficos, describe quién usará el panel y qué decisión tomará con él. Una gerencia que necesita revisar margen por sucursal requiere definiciones, filtros y niveles de detalle distintos de un equipo que solo quiere consultar ventas totales.',
        'También conviene separar un dashboard ejecutivo de un reporte operativo recurrente. Si tu necesidad principal es consolidar archivos y enviar el mismo reporte cada semana, el servicio de automatización de reportes puede ser más adecuado. Un panel de Power BI tiene sentido cuando las personas necesitan explorar indicadores, comparar periodos y volver al origen de una diferencia.'
      ]
    },
    {
      heading: 'Las fuentes y su estado suelen mover más trabajo que el diseño',
      paragraphs: [
        'Un archivo de Excel con columnas estables es diferente de varios archivos que cambian de formato, o de un CRM y un ERP con identificadores que no coinciden. Hay que comprobar permisos, frecuencia de exportación, fechas, duplicados y campos faltantes. Cuando las fuentes no comparten claves confiables, una parte importante del proyecto consiste en acordar cómo relacionarlas y qué excepciones debe revisar tu equipo.',
        'La limpieza y el modelado también afectan el alcance. Un total de ventas puede necesitar reglas para devoluciones, impuestos, monedas o pedidos cancelados. Si dos áreas usan fórmulas distintas para el mismo KPI, hay que resolver esa diferencia antes de publicar una cifra. Una propuesta seria debe indicar qué transformaciones se incluyen y cómo se validarán los resultados contra los sistemas de origen.'
      ]
    },
    {
      heading: 'Vistas, actualización y acceso cambian el alcance',
      paragraphs: [
        'El número de vistas importa, pero también lo que hace cada una. Una página de resumen, una de detalle por sucursal y otra de tendencias requieren navegación, filtros y pruebas distintas. Conviene priorizar las vistas que responden preguntas reales.',
        'La frecuencia de actualización depende de cada fuente y de sus permisos. Una carga manual revisada, una actualización diaria programada y una integración más frecuente tienen necesidades de operación diferentes. Define qué pasa cuando una fuente llega tarde o falla. También especifica cuántas personas usarán el panel y si necesitan permisos distintos por área, sucursal o rol: configurar y probar esos accesos forma parte del trabajo.'
      ]
    },
    {
      heading: 'Capacitación y mantenimiento también forman parte del costo',
      paragraphs: [
        'Un dashboard terminado debe poder entenderse sin que el creador esté presente en cada reunión. Pide un diccionario de indicadores, explicación de filtros y capacitación para quienes lo usarán. Si tu equipo será responsable de actualizar archivos o revisar errores, incluye una guía operativa y una persona encargada de cada paso.',
        'Después de la entrega pueden cambiar productos, campos del CRM, responsables o preguntas de negocio. Aclara qué ajustes están incluidos en la implementación y cuáles necesitan soporte posterior. El costo de mantener un panel depende de la estabilidad de sus fuentes y de cuánto cambien las reglas, no solo de que Power BI siga abriendo el archivo.'
      ]
    },
    {
      heading: 'Nuestros paquetes publicados como puntos de referencia',
      paragraphs: [
        'Radiografía de Datos cuesta US$750 y dura 2 semanas. Sirve para revisar fuentes, preguntas y viabilidad cuando aún no está claro qué construir. Cockpit Ejecutivo empieza en US$2,500 y dura 4–6 semanas; es la referencia para un dashboard ejecutivo con alcance definido. Sala de Control empieza en US$12,000 y dura 10–14 semanas para trabajo de integración más amplio. Estos son paquetes de Sagepoint, no precios promedio del mercado ni una cotización automática para tu proyecto.',
        'Soporte Cercano empieza en US$300/mes cuando necesitas acompañamiento después de la entrega. La llamada de diagnóstico es gratuita y dura 30–45 minutos. En ella revisamos un ejemplo de tus datos y la decisión que quieres mejorar; después podemos indicar qué paquete encaja, qué queda fuera y qué información falta para cotizar con precisión.'
      ]
    },
    {
      heading: 'Licencias y cuentas: qué se cotiza por separado',
      paragraphs: [
        'Las licencias de Microsoft son separadas del trabajo de Sagepoint y permanecen en la cuenta de Microsoft del cliente. Trabajamos dentro de tus propias cuentas y licencias, con los accesos que autorices. No incluimos aquí precios de licencias porque dependen del producto, la modalidad y la configuración de tu organización.',
        'Antes de aceptar una propuesta, confirma quién administrará los accesos, dónde quedarán el archivo y el modelo, y qué usuarios podrán ver o editar el contenido.'
      ]
    },
    {
      heading: 'Cómo pedir una cotización comparable',
      paragraphs: [
        'Lleva una muestra de los archivos o exportaciones y describe los sistemas de origen. Anota los indicadores que usas hoy, sus fórmulas conocidas y las preguntas que todavía no puedes responder. Indica quién usará el dashboard, qué permisos necesita, con qué frecuencia deben cambiar los datos y quién aprobará los números antes de publicar.',
        'Pide que cada propuesta detalle fuentes incluidas, limpieza y modelado, vistas, frecuencia de actualización, validaciones, capacitación, documentación, plazo, revisiones y soporte posterior. Solicita que las licencias se indiquen aparte.'
      ]
    }
  ],
  faq: [
    { question: '¿Cuánto cuesta un dashboard de Power BI en Guatemala?', answer: 'Depende de fuentes, limpieza, modelo, vistas, actualización y permisos. En Sagepoint, Cockpit Ejecutivo empieza en US$2,500 y dura 4–6 semanas; la cotización final se define después de revisar el alcance.' },
    { question: '¿El precio incluye licencias de Power BI?', answer: 'No. Las licencias son separadas y permanecen en tu propia cuenta de Microsoft. Sagepoint trabaja dentro de las cuentas y licencias del cliente con acceso autorizado.' },
    { question: '¿Qué pasa si mis datos todavía están desordenados?', answer: 'Primero revisamos fuentes, definiciones y problemas de calidad. Radiografía de Datos cuesta US$750 y dura 2 semanas; puede ayudar a precisar qué trabajo se necesita antes de construir un dashboard.' },
    { question: '¿Hay un costo después de entregar el dashboard?', answer: 'Depende de los cambios y del soporte que necesites. Soporte Cercano empieza en US$300/mes. La propuesta de implementación debe aclarar qué revisiones y capacitación están incluidas.' }
  ]
};

export const GUIDES = [POWER_BI_COST_GUIDE];
