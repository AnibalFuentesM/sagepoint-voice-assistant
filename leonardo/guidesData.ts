export type Guide = {
  lang: 'es' | 'en'; source: string;
  /** Service page this guide belongs to (breadcrumb and closing link). */
  service: { path: string; name: string; linkText: string };
  path: string; title: string; description: string; h1: string; lede: string;
  sections: { heading: string; paragraphs: string[] }[];
  faq: { question: string; answer: string }[];
};

export const POWER_BI_COST_GUIDE: Guide = {
  lang: 'es', source: 'guide_power_bi_cost',
  service: { path: '/servicios/dashboards-power-bi-guatemala/', name: 'Dashboards Power BI', linkText: 'dashboards Power BI en Guatemala →' },
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
      heading: 'El estado de las fuentes suele pesar más en el costo que el diseño',
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
        'Radiografía de Datos cuesta US$750, pago único: en 14 días y con 90 minutos de tu equipo auditamos dos fuentes y te dejamos un dashboard vivo con hasta ocho KPIs y un informe de oportunidades priorizadas; se acredita completa al proyecto si contratas en 30 días. Cockpit Ejecutivo empieza en US$2,500 y dura 4–6 semanas: hasta cuatro fuentes, hasta tres dashboards ejecutivos y un flujo de reportes automatizado, con dos capacitaciones y dos rondas de revisiones (no incluye data warehouse ni modelos a medida). Sala de Control empieza en US$12,000 y dura 10–14 semanas para trabajo de integración más amplio. Estos son paquetes de Sagepoint, no precios promedio del mercado ni una cotización automática para tu proyecto.',
        'Soporte Cercano tiene tres niveles desde US$300/mes, con dos meses de cortesía si prepagas el año. La llamada de diagnóstico es gratuita, dura 30–45 minutos y te llevas un diagnóstico escrito aunque no contrates. En ella revisamos un ejemplo de tus datos y la decisión que quieres mejorar; después podemos indicar qué paquete encaja, qué queda fuera y qué información falta para cotizar con precisión.'
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

export const DASHBOARD_COST_GUIDE_EN: Guide = {
  lang: 'en', source: 'guide_dashboard_cost_en',
  service: { path: '/en/services/small-business-dashboards/', name: 'Small business dashboards', linkText: 'small business dashboards →' },
  path: '/en/guides/small-business-dashboard-cost/',
  title: 'How Much Does a Small Business Dashboard Cost? | Sagepoint',
  description: 'What changes the price of a Power BI or Looker Studio dashboard for a small business, our published US prices, and how to ask for a quote you can compare.',
  h1: 'How much does a dashboard cost for a small business?',
  lede: 'It depends on the work behind the screen, not on the number of charts. Two dashboards that look the same can take very different effort if one reads a clean spreadsheet and the other has to match QuickBooks, a CRM and three Excel files. This guide shows what drives the price, what we charge, and what to ask any provider before you sign.',
  sections: [
    {
      heading: 'Start with the decision, not the charts',
      paragraphs: [
        'Before counting charts, write down who will open the dashboard and what they will decide with it. An owner who checks margin by location every Monday needs different definitions, filters and detail than a team that only wants total sales for the month.',
        'Also separate a dashboard from a recurring report. If what you really need is the same Excel report built and emailed every week, report automation is usually cheaper. A dashboard makes sense when people need to compare periods, filter by product or salesperson and click back to where a number came from.'
      ]
    },
    {
      heading: 'Your data sources drive the price more than the design',
      paragraphs: [
        'One spreadsheet with stable columns is a small job. Several files that change format every month, or a CRM and QuickBooks that use different customer names, take longer. Someone has to check access, export schedules, dates, duplicates and missing fields, and agree on how records match.',
        'Definitions matter too. A sales total may need rules for refunds, sales tax, discounts or canceled orders. If two people calculate gross margin differently, that has to be settled before the number goes on a screen. A serious proposal says which cleanup is included and how the totals will be checked against your own systems.'
      ]
    },
    {
      heading: 'Views, refresh and access change the scope',
      paragraphs: [
        'The number of views matters, and so does what each one does. A summary page, a detail page by location and a trends page each need their own filters and testing. Start with the views that answer questions you already ask every week.',
        'Refresh depends on each source and its permissions: a reviewed manual upload, a scheduled daily refresh and a near real-time connection are different amounts of work. Also say how many people will use it and whether they need different access by location or role, because setting up and testing permissions is part of the job.'
      ]
    },
    {
      heading: 'Training and support after delivery',
      paragraphs: [
        'A finished dashboard should make sense without its builder in the room. Ask for a short definitions sheet, an explanation of the filters and a walkthrough for the people who will use it.',
        'Products, CRM fields and questions change after launch. Ask which changes are included in the project and which need ongoing support. The cost of keeping a dashboard useful depends on how often your sources and rules change.'
      ]
    },
    {
      heading: 'Our published prices as a reference',
      paragraphs: [
        'The 14-Day Dashboard Pilot is US$750: I connect two of your sources, for example QuickBooks and your sales spreadsheet, and build a working dashboard with up to eight of your numbers. If it is not useful to you, you do not pay, and if you continue within 30 days the US$750 comes off the next project. Executive Cockpit is a fixed US$3,900 and takes 4 to 6 weeks: up to four sources, up to three dashboards and one report that builds and sends itself every week. Control Room starts at US$15,000 and takes 10 to 14 weeks when several systems need to be integrated. Projects are paid 50% to start and 50% on delivery.',
        'Monthly support is US$450, US$900 or US$1,800, with no hour counting and cancel any month; paying the year upfront gives two months free. These are Sagepoint prices, not market averages or an automatic quote for your project. The free call takes 30 to 45 minutes: we look at a sample of your data and the decision you want to improve, then tell you which option fits and what is left out.'
      ]
    },
    {
      heading: 'Software licenses are separate',
      paragraphs: [
        'Power BI, Looker Studio or Google Workspace licenses are not part of our price and stay in your own accounts. We work inside your accounts with the access you approve, so the files, the data model and the logins stay yours.',
        'Before you accept any proposal, confirm who manages access, where the files and data model will live, and who can view or edit them.'
      ]
    },
    {
      heading: 'How to ask for a quote you can compare',
      paragraphs: [
        'Bring a sample export from each source and a copy of the report you use today. List the numbers you track, how you calculate them, and the questions you still cannot answer. Say who will use the dashboard, how often the data should update and who signs off on the numbers.',
        'Ask every provider to list sources, cleanup, views, refresh frequency, checks, training, documentation, timeline, revisions and support in writing, with licenses quoted separately. Then you are comparing the same thing.'
      ]
    }
  ],
  faq: [
    { question: 'How much does a Power BI dashboard cost for a small business?', answer: 'It depends on sources, cleanup, views, refresh and permissions. At Sagepoint, the 14-Day Dashboard Pilot is US$750 for two sources and Executive Cockpit is a fixed US$3,900 for up to four sources and three dashboards. The price is agreed in writing before work starts.' },
    { question: 'Does the price include Power BI licenses?', answer: 'No. Licenses are separate and stay in your own Microsoft or Google account. We work inside your accounts with the access you approve.' },
    { question: 'What if my data is still messy?', answer: 'That is common. The 14-Day Dashboard Pilot is a low-risk way to find out: we connect two sources, check the totals against your systems and show you what needs fixing before a bigger project.' },
    { question: 'Is there a cost after the dashboard is delivered?', answer: 'Only if you want ongoing changes. Monthly support is US$450, US$900 or US$1,800 depending on how much you want added each month, with no hour counting and cancel any month.' }
  ]
};

export const GUIDES = [POWER_BI_COST_GUIDE, DASHBOARD_COST_GUIDE_EN];
