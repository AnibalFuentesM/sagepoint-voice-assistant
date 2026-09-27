export type Service = {
  lang: 'es' | 'en'; slug: string; path: string; title: string; description: string; h1: string;
  subhead: string; problemIntro: string; symptoms: string[]; approach: string;
  deliverables: { title: string; detail: string }[]; process: string[]; proof?: string;
  validation?: { title: string; detail: string };
  packageFit: string; faq: { question: string; answer: string }[];
};

export const SERVICES: Service[] = [
  {
    lang: 'es', slug: 'dashboards-power-bi-guatemala', path: '/servicios/dashboards-power-bi-guatemala/',
    title: 'Dashboards Power BI en Guatemala | Sagepoint',
    description: 'Dashboards ejecutivos en Power BI, Looker Studio o Sheets para PYMEs en Guatemala. Unifica ventas, finanzas y operación en una vista clara.',
    h1: 'Dashboards ejecutivos y Power BI para empresas en Guatemala',
    subhead: 'Tus ventas, márgenes y operación viven en archivos y sistemas separados. Diseñamos un dashboard que permite a gerencia ver la misma información, entender su origen y decidir con menos espera.',
    problemIntro: 'Una pantalla vistosa no resuelve datos contradictorios. Primero acordamos qué significa cada indicador, de dónde viene y quién lo necesita para decidir.',
    symptoms: [
      'Llego a la reunión con cifras distintas según el archivo que abrió cada responsable y perdemos tiempo conciliándolas.',
      'Veo ventas totales, pero no puedo explicar qué sucursal, categoría o costo está moviendo el margen.',
      'Mi equipo arma una presentación nueva cada semana y la información ya perdió vigencia cuando la revisamos.'
    ],
    approach: 'Elegimos Power BI, Looker Studio o Google Sheets según tus fuentes, permisos, frecuencia de actualización y forma de trabajar.',
    deliverables: [
      { title: 'Mapa de fuentes y definiciones', detail: 'Identificamos archivos, CRM o ERP disponibles y dejamos por escrito fórmulas, filtros y responsables de cada KPI.' },
      { title: 'Modelo de datos', detail: 'Limpiamos y relacionamos fuentes con Power Query, conexiones existentes o transformaciones adecuadas al alcance.' },
      { title: 'Vista ejecutiva', detail: 'Construimos páginas para tendencias, desviaciones y segmentos relevantes, con navegación clara y contexto de cada número.' },
      { title: 'Actualización verificable', detail: 'Definimos cómo se refrescan los datos y qué validaciones permiten detectar una carga incompleta antes de usarla.' },
      { title: 'Entrega al equipo', detail: 'Incluimos documentación de fuentes y métricas, revisión con usuarios y capacitación para interpretar y mantener el panel.' }
    ],
    process: [
      'En una llamada gratuita de 30–45 min vemos decisiones, fuentes y un ejemplo del reporte actual. Te decimos qué falta para estimar bien el trabajo.',
      'Preparamos una propuesta con alcance, indicadores, accesos, entregables, plazo y revisiones acordadas antes de construir.',
      'Construimos el modelo y el dashboard, contrastamos totales contra las fuentes y revisamos prototipos contigo hasta ajustar la lectura.',
      'Entregamos el panel, las definiciones y una guía de uso. Si quieres cambios y mantenimiento después, Soporte Cercano empieza en US$300/mes.'
    ],
    proof: 'Apex Auto Group — cockpit ejecutivo en Power BI: un solo cockpit para 12 concesionarios y 85 feeds de DMS. El caso publicado muestra cómo una vista compartida ayudó a ver la fuga de margen en repuestos el mismo día, no semanas después.',
    packageFit: 'Si todavía hay que validar fuentes y preguntas, Radiografía de Datos (US$750, 2 semanas) suele ser el punto de partida. Para construir un dashboard ejecutivo, Cockpit Ejecutivo empieza en US$2,500. Sala de Control, desde US$12,000, corresponde a una integración más amplia; el paquete final depende del alcance.',
    faq: [
      { question: '¿Cuánto cuesta desarrollar un dashboard de Power BI en Guatemala?', answer: 'Depende de las fuentes, la limpieza necesaria, la cantidad de vistas y quién debe acceder. Cockpit Ejecutivo empieza en US$2,500, pero primero revisamos un ejemplo de tus datos y definimos el alcance en una propuesta. Radiografía de Datos (US$750) puede servir si aún hay que aclarar el problema. Lee nuestra guía de costos para comparar alcances.' },
      { question: '¿Pueden usar mis archivos de Excel y los datos de mi sistema actual?', answer: 'Sí, si podemos acceder a ellos de forma autorizada y entender sus campos. Revisamos si el sistema permite exportación, API o conexión directa, y validamos que los totales coincidan antes de publicar la vista.' },
      { question: '¿Qué KPIs debería mostrar un dashboard para gerencia?', answer: 'Los que explican una decisión: por ejemplo, ventas, margen y desviaciones por unidad de negocio. En el diagnóstico preguntamos qué acciones toma gerencia, qué definiciones utiliza y qué datos están disponibles. Evitamos llenar la pantalla de métricas sin dueño.' },
      { question: '¿Cada cuánto se actualizan los datos del dashboard?', answer: 'Depende del origen, los permisos y la herramienta elegida. Podemos diseñar una carga programada o un proceso de actualización controlado; la propuesta especifica la frecuencia posible y qué ocurre si una fuente no llega.' },
      { question: '¿Conviene Power BI, Looker Studio o Google Sheets para mi empresa?', answer: 'Depende del volumen, las conexiones, el costo de licencias y la forma en que compartes información. Power BI suele encajar con modelos más complejos; Looker Studio y Sheets pueden servir para otros flujos. Recomendamos después de revisar tus fuentes y usuarios.' }
    ]
  },
  {
    lang: 'es', slug: 'automatizar-reportes-excel-sheets', path: '/servicios/automatizar-reportes-excel-sheets/',
    title: 'Automatizar reportes Excel y Sheets | Sagepoint',
    description: 'Automatiza la consolidación y entrega de reportes en Excel o Google Sheets con Power Query, VBA o Apps Script. Menos tareas manuales.',
    h1: 'Automatización de reportes en Excel y Google Sheets',
    subhead: 'Cada semana vuelves a descargar, copiar, corregir y enviar los mismos archivos. Diseñamos un flujo repetible para consolidar datos, revisar excepciones y entregar el reporte que tu equipo ya necesita.',
    problemIntro: 'El problema no es que uses Excel o Sheets. Es que el resultado depende de una secuencia manual difícil de auditar y de una persona que conoce todos los trucos del archivo.',
    symptoms: [
      'Recibo varios archivos con columnas parecidas y paso horas copiando filas antes de poder analizar algo.',
      'Una fórmula se rompe o una versión vieja llega al correo y nadie sabe cuál es el reporte correcto.',
      'Debo rehacer el envío para cada destinatario aunque los datos y las reglas cambian muy poco.'
    ],
    approach: 'Conservamos el formato útil para tus lectores y automatizamos los pasos que generan trabajo y errores. Power Query sirve para transformar fuentes repetidas; VBA puede cubrir tareas dentro de un libro; Apps Script conecta hojas y envíos en Google Workspace. Elegimos después de ver el flujo real.',
    deliverables: [
      { title: 'Inventario del flujo', detail: 'Documentamos archivos de entrada, responsables, calendario, reglas de negocio y destinatarios.' },
      { title: 'Consolidación reproducible', detail: 'Configuramos Power Query, VBA, Apps Script o Python según dónde están los datos y cómo llega cada archivo.' },
      { title: 'Validaciones', detail: 'Marcamos archivos faltantes, formatos inesperados y diferencias de totales para revisión antes de distribuir.' },
      { title: 'Salida pactada', detail: 'Dejamos el reporte en Excel o Google Sheets con las columnas, filtros y cortes que usan sus lectores.' },
      { title: 'Guía operativa', detail: 'Entregamos instrucciones para ejecutar, revisar excepciones y ajustar fuentes comunes sin depender del desarrollador.' }
    ],
    process: [
      'La llamada gratuita de 30–45 min recorre un ciclo completo: archivos recibidos, trabajo manual y reporte enviado.',
      'Cotizamos un alcance con fuentes, formatos, validaciones, frecuencia, destinatarios y revisiones definidos.',
      'Construimos con muestras reales, comparamos el resultado con el reporte actual y ajustamos las excepciones contigo.',
      'Entregamos scripts o consultas, documentación y capacitación. Soporte Cercano desde US$300/mes puede cubrir ajustes posteriores.'
    ],
    proof: 'Operador BPO multi-cliente: catorce sistemas de telefonía y CRM consolidados a diario en un motor de reportería. El caso publicado registra 33,370 filas reconciliadas, 79 semanas y un cumplimiento de SLA que pasó de ~81% a más de 99%, liberando más de 25 horas de supervisión por semana.',
    packageFit: 'Radiografía de Datos (US$750, 2 semanas) ayuda a ordenar fuentes y reglas antes de automatizar. Cockpit Ejecutivo, desde US$2,500, incluye un flujo de reportes dentro de su alcance publicado. Para integraciones extensas, Sala de Control empieza en US$12,000; la propuesta determina el encaje real.',
    faq: [
      { question: '¿Se puede automatizar un reporte si recibo varios archivos Excel cada semana?', answer: 'Sí, si identificamos un patrón de nombres, columnas y entrega. Revisamos muestras de ciclos distintos para definir cómo consolidarlos y qué hacer cuando falta un archivo o aparece un formato nuevo.' },
      { question: '¿Cuándo conviene Power Query y cuándo una macro VBA?', answer: 'Power Query suele ser útil para importar y transformar datos repetidamente. VBA puede resolver interacción y pasos propios de un libro de Excel. La elección depende de los archivos, permisos y quién mantendrá el proceso.' },
      { question: '¿Se pueden programar reportes automáticos desde Google Sheets?', answer: 'Apps Script permite ejecutar tareas programadas en Google Workspace, sujeto a permisos y límites de la cuenta. Revisamos el volumen, la frecuencia y las validaciones necesarias antes de proponer un envío automático.' },
      { question: '¿Qué pasa si cambia el formato de uno de los archivos de origen?', answer: 'Definimos controles para detectar columnas ausentes o datos inesperados y evitar una entrega silenciosamente incorrecta. La adaptación a cambios futuros puede quedar en una guía o en un acuerdo de soporte.' },
      { question: '¿Pueden dejar el reporte documentado para que mi equipo lo mantenga?', answer: 'Sí. La entrega incluye origen de datos, pasos de ejecución, reglas de cálculo y manejo de errores acordados. También hacemos una revisión con la persona que lo operará.' }
    ]
  },
  {
    lang: 'es', slug: 'automatizacion-procesos-pymes', path: '/servicios/automatizacion-procesos-pymes/',
    title: 'Automatización de procesos para PYMEs | Sagepoint',
    description: 'Automatiza tareas administrativas y flujos repetitivos en tu PYME en Guatemala. Conectamos archivos, aplicaciones y pasos manuales.',
    h1: 'Automatización de procesos para PYMEs en Guatemala',
    subhead: 'Tu equipo repite capturas, descargas y verificaciones entre herramientas que ya usa. Analizamos esos pasos y automatizamos los que se pueden ejecutar con reglas claras y supervisión.',
    problemIntro: 'Automatizar un proceso administrativo exige entender excepciones, permisos y decisiones humanas. Un script que funciona con un archivo de muestra no es suficiente para un flujo que debe seguir siendo confiable cuando cambian las entradas.',
    symptoms: [
      'Copio la misma información entre una hoja, un sistema y un correo para completar un trámite.',
      'Debo revisar portales o descargar archivos a mano antes de saber si ocurrió algo que requiere acción.',
      'Cuando la persona que conoce el procedimiento falta, el trabajo se detiene o se hacen pasos distintos.'
    ],
    approach: 'Mapeamos el proceso desde la entrada hasta la decisión final. Usamos APIs cuando existen y son apropiadas; Python, Apps Script o Playwright pueden ayudar en otros pasos autorizados. Separamos lo automático de lo que necesita revisión humana y registramos los fallos.',
    deliverables: [
      { title: 'Mapa del proceso actual', detail: 'Identificamos entradas, sistemas, responsables, reglas, excepciones y puntos de aprobación.' },
      { title: 'Diseño del flujo', detail: 'Definimos qué pasos pueden ejecutarse con API, archivos, Apps Script, Python o automatización de navegador.' },
      { title: 'Automatización acotada', detail: 'Construimos tareas concretas de captura, transformación, consulta o aviso según los accesos disponibles.' },
      { title: 'Controles y registro', detail: 'Añadimos comprobaciones de entrada y salida, estados de error y una forma clara de retomar el trabajo.' },
      { title: 'Transferencia', detail: 'Entregamos documentación, instrucciones de operación y capacitación para que el equipo supervise el flujo.' }
    ],
    process: [
      'En una llamada gratuita de 30–45 min recorremos el trabajo actual y sus excepciones; necesitamos ver una muestra o demostración autorizada.',
      'La propuesta define pasos incluidos, accesos, criterios de aceptación, revisiones y dependencias de terceros.',
      'Construimos por partes, probamos casos normales y fallidos con tu equipo y corregimos lo observado en las revisiones.',
      'Hacemos la entrega con documentación y responsables. Soporte Cercano desde US$300/mes queda disponible para cambios posteriores.'
    ],
    proof: 'Operador BPO multi-cliente: el caso publicado consolidó a diario datos de catorce sistemas de telefonía y CRM. El motor de reportería reconcilió 33,370 filas y liberó más de 25 horas de supervisión por semana. Es un ejemplo de proceso repetitivo convertido en un flujo verificable.',
    packageFit: 'Radiografía de Datos (US$750, 2 semanas) sirve para descubrir y priorizar oportunidades. Cockpit Ejecutivo empieza en US$2,500 cuando el proyecto combina datos y un flujo de reportes. Sala de Control, desde US$12,000, suele encajar mejor en procesos e integraciones amplios; siempre se cotiza el alcance.',
    faq: [
      { question: '¿Qué procesos de una PYME vale la pena automatizar primero?', answer: 'Los que se repiten, tienen reglas claras y consumen tiempo sin requerir una decisión nueva en cada caso. Revisamos frecuencia, excepciones, impacto de errores y accesos antes de priorizar.' },
      { question: '¿Se puede automatizar un sistema que no ofrece API?', answer: 'A veces, mediante archivos o automatización de navegador autorizada. Depende de las funciones disponibles, las condiciones del sistema y la estabilidad de su interfaz. Lo evaluamos antes de comprometer un alcance.' },
      { question: '¿Cómo se supervisa una automatización para detectar errores?', answer: 'Diseñamos validaciones, registros de ejecución y una ruta de revisión para entradas incompletas o resultados inesperados. La persona responsable debe saber cuándo intervenir y cómo reanudar el proceso.' },
      { question: '¿Debo cambiar mi software actual para automatizar un proceso?', answer: 'No necesariamente. Primero examinamos las exportaciones, APIs y acciones permitidas por tus herramientas actuales. Si una limitación impide un flujo confiable, la explicamos en la propuesta.' },
      { question: '¿Qué información necesitan para estimar el alcance de un proyecto?', answer: 'Un recorrido del proceso, ejemplos de entradas y salidas, sistemas involucrados, frecuencia y principales excepciones. También necesitamos saber qué accesos se pueden conceder y quién aprobará el resultado.' }
    ]
  },
  {
    lang: 'es', slug: 'integracion-crm-erp-apis', path: '/servicios/integracion-crm-erp-apis/',
    title: 'Integración de CRM y ERP en Guatemala | Sagepoint',
    description: 'Conecta CRM, ERP y otras aplicaciones mediante APIs o intercambios de datos. Evita duplicar capturas y mantén información consistente.',
    h1: 'Integración de CRM, ERP y aplicaciones para empresas',
    subhead: 'Cuando ventas y operación trabajan con registros distintos, el mismo cliente o pedido cambia de significado entre sistemas. Diseñamos integraciones para compartir los datos necesarios con reglas claras y trazabilidad.',
    problemIntro: 'Conectar un CRM con un ERP exige decidir qué sistema gobierna cada campo, cuándo se actualiza y qué hacer ante un conflicto. Una copia automática sin esas reglas puede multiplicar duplicados.',
    symptoms: [
      'Mi equipo registra un pedido en el CRM y vuelve a capturarlo en el ERP.',
      'El estado de un cliente cambia en un sistema, pero otro equipo sigue viendo la versión anterior.',
      'Los errores de sincronización se descubren cuando alguien ya tomó una decisión con datos incompletos.'
    ],
    approach: 'Revisamos APIs, exportaciones y permisos de tus sistemas actuales. Definimos identificadores, dirección del intercambio, frecuencia y manejo de errores antes de construir una conexión. Esta página cubre integración de registros entre sistemas; los reportes de Excel y las tareas administrativas tienen servicios propios.',
    deliverables: [
      { title: 'Mapa de entidades', detail: 'Identificamos clientes, productos, pedidos u otras entidades que necesitan cruzar entre aplicaciones y sus campos clave.' },
      { title: 'Reglas de sincronización', detail: 'Documentamos sistema de origen, transformaciones, identificadores, frecuencia y resolución de conflictos.' },
      { title: 'Conexión acotada', detail: 'Implementamos intercambio por API o archivos cuando la plataforma y los accesos lo permiten.' },
      { title: 'Controles de calidad', detail: 'Detectamos duplicados, rechazos y registros incompletos, con una ruta de revisión para tu equipo.' },
      { title: 'Entrega documentada', detail: 'Dejamos instrucciones de operación, permisos y pruebas para cambios futuros.' }
    ],
    process: [
      'La llamada gratuita de 30–45 min identifica sistemas, registros compartidos y un ejemplo de discrepancia.',
      'Revisamos documentación y accesos autorizados; proponemos alcance, campos, reglas y pruebas de aceptación.',
      'Construimos y probamos con casos normales, duplicados y errores; comparamos resultados con ambos sistemas.',
      'Entregamos la integración documentada. Soporte Cercano desde US$300/mes puede cubrir cambios posteriores.'
    ],
    validation: { title: 'Cómo verificamos la integración', detail: 'Probamos altas, cambios y errores con registros de muestra de ambos sistemas. Comparamos identificadores y campos de origen y destino, comprobamos que una repetición no cree duplicados y revisamos cómo se alerta y corrige una sincronización fallida. La prueba de aceptación se acuerda con tu equipo.' },
    packageFit: 'Radiografía de Datos (US$750, 2 semanas) permite aclarar entidades y reglas. Sala de Control, desde US$12,000 y con un plazo de 10–14 semanas, es una referencia para integraciones amplias. El alcance de cada conexión se cotiza tras revisar los sistemas.',
    faq: [
      { question: '¿Qué datos conviene sincronizar entre el CRM y el ERP?', answer: 'Solo los registros que sostienen un proceso concreto, como clientes, pedidos o estados. Definimos campos, propietario de cada dato y momento de actualización antes de conectar sistemas.' },
      { question: '¿Se puede integrar un sistema antiguo que no tiene API?', answer: 'Puede ser posible mediante exportaciones e importaciones autorizadas. Revisamos formatos, frecuencia y controles; si el sistema no ofrece una vía confiable, lo explicamos antes de cotizar.' },
      { question: '¿Cómo se evitan los clientes o pedidos duplicados?', answer: 'Acordamos identificadores y reglas para buscar coincidencias antes de crear registros. Los casos ambiguos se marcan para revisión en lugar de unirlos automáticamente.' },
      { question: '¿La integración puede actualizar datos en ambas direcciones?', answer: 'Sí, si los sistemas lo permiten y existe una regla clara sobre cuál prevalece en cada campo. Una sincronización bidireccional requiere resolver conflictos y probar cambios simultáneos.' },
      { question: '¿Quién corrige los errores si una sincronización falla?', answer: 'Definimos responsables, alertas y un registro de fallos en el alcance. Tu equipo puede revisar excepciones; un acuerdo de soporte puede cubrir ajustes técnicos posteriores.' }
    ]
  },
  {
    lang: 'es', slug: 'pronosticos-ventas-demanda', path: '/servicios/pronosticos-ventas-demanda/',
    title: 'Pronósticos de ventas y demanda | Sagepoint',
    description: 'Modelos de pronóstico de ventas y demanda para planificar compras, inventario y metas. Partimos de tus datos y validamos la precisión.',
    h1: 'Pronósticos de ventas y demanda para tu empresa',
    subhead: 'Un pronóstico útil muestra qué podría venderse, a qué nivel de detalle y con cuánta incertidumbre. Trabajamos con tu historial para apoyar compras, inventario y metas sin presentar una predicción como certeza.',
    problemIntro: 'Una cifra proyectada pierde utilidad si mezcla productos discontinuados, cambios de precio o temporadas distintas. Primero evaluamos la calidad y el alcance del historial disponible.',
    symptoms: [
      'Planifico compras con la venta del último mes aunque sé que hay temporadas muy distintas.',
      'Cada sucursal envía su estimación y no puedo comparar el error con un criterio común.',
      'No sé si el modelo mejora una referencia simple basada en periodos anteriores.'
    ],
    approach: 'Definimos el horizonte y la unidad de pronóstico según la decisión: producto, sucursal o canal cuando el historial lo permite. Preparamos datos, comparamos métodos sencillos y modelos más elaborados, y explicamos el error observado. El entregable es un proceso de pronóstico y revisión, no un dashboard de ventas genérico.',
    deliverables: [
      { title: 'Diagnóstico del historial', detail: 'Revisamos periodos, faltantes, cambios de catálogo, devoluciones y posibles factores estacionales.' },
      { title: 'Definición del pronóstico', detail: 'Acordamos nivel de detalle, horizonte, frecuencia y decisiones que usarán la estimación.' },
      { title: 'Modelo y comparación', detail: 'Probamos una referencia simple y alternativas apropiadas para el volumen y estabilidad de tus datos.' },
      { title: 'Medición del error', detail: 'Separamos periodos pasados para probar predicciones y mostramos dónde falla el modelo.' },
      { title: 'Guía de actualización', detail: 'Documentamos datos requeridos, supuestos y revisión periódica cuando entren ventas nuevas.' }
    ],
    process: [
      'En una llamada gratuita de 30–45 min revisamos la decisión comercial y una muestra de ventas históricas.',
      'Acordamos fuentes, nivel de detalle, periodos de evaluación y entregables antes de estimar el proyecto.',
      'Limpiamos el historial, entrenamos y contrastamos alternativas con periodos que no se usaron para ajustarlas.',
      'Entregamos resultados, límites, guía de uso y una propuesta de actualización si el modelo demuestra utilidad.'
    ],
    validation: { title: 'Cómo validamos un pronóstico', detail: 'Reservamos periodos históricos para comparar lo pronosticado con lo que realmente ocurrió. Medimos el error por segmento y temporada, contrastamos con una referencia simple y revisamos si la precisión alcanza para la decisión que quieres tomar. Si el historial no permite una estimación confiable, lo decimos.' },
    packageFit: 'Radiografía de Datos (US$750, 2 semanas) sirve para evaluar si el historial permite modelar. Un proyecto posterior requiere alcance propio; Cockpit Ejecutivo desde US$2,500 y 4–6 semanas solo aplica si además se acuerda una vista ejecutiva. No asignamos un precio fijo al pronóstico antes de evaluar datos.',
    faq: [
      { question: '¿Cuántos meses de ventas históricas se necesitan para un pronóstico?', answer: 'Depende del horizonte, la estacionalidad y el nivel de detalle. Revisamos si hay suficientes ciclos comparables; un historial corto puede permitir una estimación limitada, pero no una validación sólida de temporadas.' },
      { question: '¿Se puede pronosticar por producto, sucursal o canal?', answer: 'Sí, cuando cada segmento tiene registros suficientes y consistentes. Si un producto vende de forma esporádica, quizá convenga agruparlo o usar un método diferente.' },
      { question: '¿Cómo se mide si el pronóstico está funcionando?', answer: 'Comparamos predicciones con periodos reales que el modelo no usó para ajustarse. Mostramos el error por segmento y horizonte, y verificamos si supera una referencia sencilla.' },
      { question: '¿Qué hacemos si las ventas tienen mucha estacionalidad?', answer: 'Identificamos ciclos y eventos conocidos, y probamos el modelo en temporadas anteriores. Si faltan ciclos comparables, comunicamos esa incertidumbre en lugar de ocultarla.' },
      { question: '¿Puede empezar el modelo con datos que hoy están en Excel?', answer: 'Sí. Revisamos fechas, productos, unidades, devoluciones y cambios de formato. Primero ordenamos el historial y evaluamos si permite comparar periodos.' }
    ]
  },
  {
    lang: 'en', slug: 'call-center-kpi-dashboards', path: '/en/services/call-center-kpi-dashboards/',
    title: 'Call Center KPI Dashboards | Sagepoint',
    description: 'Custom dashboards for call center leaders. Bring SLA, AHT, queue volume, abandonment and agent performance into one operational view.',
    h1: 'Call center KPI dashboards built around your operation',
    subhead: 'Queue metrics, CRM outcomes, and quality data sit in different exports. We build an operational view that helps supervisors explain changes and act on the same agreed definitions.',
    problemIntro: 'An attractive contact center dashboard is only useful when its metrics match the way your operation actually runs. We define the denominator, queue scope, time zone, and data freshness before turning a chart into a management decision.',
    symptoms: [
      'I compare ACD and CRM exports by hand before each operations review and still cannot explain a mismatch.',
      'Supervisors see a service level number but cannot tell which queue, interval, or staffing pattern changed it.',
      'Agent performance lives in separate reports, so coaching conversations start with a debate about the data.'
    ],
    approach: 'We work on top of your existing contact center, CRM, and reporting systems. The result can use Power BI, Looker Studio, or another appropriate reporting layer; we are building measurement and decision support, not replacing the platform that handles calls.',
    deliverables: [
      { title: 'Metric specification', detail: 'Document agreed definitions for SLA, AHT, abandonment, volume, and other KPIs that your managers actually use.' },
      { title: 'Source reconciliation', detail: 'Map ACD, CRM, and available QA exports, then identify missing records, timing differences, and incompatible identifiers.' },
      { title: 'Operational dashboard', detail: 'Create views by queue, interval, program, and agent where the underlying data supports them.' },
      { title: 'Refresh and checks', detail: 'Define a feasible update cadence and surface late or incomplete source data before it misleads a supervisor.' },
      { title: 'Handoff', detail: 'Provide data definitions, access guidance, review rounds, and training for the people who will use the view.' }
    ],
    process: [
      'A free 30–45 minute assessment covers decisions, sample exports, current reports, and the teams that will use them.',
      'We propose a defined scope with sources, metrics, access, review rounds, deliverables, and an agreed schedule.',
      'We build the data model and views, reconcile them against source totals, and review the interpretation with your operations team.',
      'We hand over documentation and training. Ongoing support starts at US$300/month if you need later adjustments.'
    ],
    proof: 'Multi-client BPO operator: the published case describes daily consolidation across fourteen telephony and CRM systems. SLA compliance moved from about 81% to over 99%, and the workflow freed more than 25 supervisor hours per week. The dashboard work is grounded in reconciled operational data, not a generic template.',
    packageFit: 'Data Assessment (US$750, 2 weeks) helps when metric definitions and source quality need discovery. Executive Cockpit starts at US$2,500 for a scoped dashboard build. Control Room starts at US$12,000 for wider integrations; the right package depends on your sources and deliverables.',
    faq: [
      { question: 'Which KPIs should a small call center dashboard track first?', answer: 'Start with measures tied to decisions: demand, service level, abandonment, handling time, and a quality or outcome measure where available. We agree on definitions and queue scope with your managers before deciding which charts belong in the first view.' },
      { question: 'Can you combine ACD, CRM and QA data in one dashboard?', answer: 'Often, if exports or authorized connections are available and records can be matched reliably. We inspect sample data, identifiers, permissions, and refresh limits before committing to a combined view.' },
      { question: 'How should service level and abandonment be defined across queues?', answer: 'The thresholds and exclusions should reflect your operating agreements. We document each formula, eligible interactions, time window, and queue mapping so comparisons do not silently mix different definitions.' },
      { question: 'Can supervisors see both live and historical performance?', answer: 'Historical reporting is usually feasible from retained exports. A live view depends on your platform access, API limits, and required latency; we confirm the achievable cadence during scoping rather than promise real-time data.' },
      { question: 'Do we need to replace our contact center platform?', answer: 'No. We build reporting from your existing systems where access and data quality allow. If a needed measure cannot be produced from those sources, we identify that gap in the proposal.' }
    ]
  },
  {
    lang: 'en', slug: 'bpo-client-reporting-automation', path: '/en/services/bpo-client-reporting-automation/',
    title: 'BPO Client Reporting Automation | Sagepoint',
    description: 'Automate recurring BPO client reports across programs. Reconcile exports, apply agreed SLA definitions and deliver consistent updates.',
    h1: 'Automated client reporting for contact center BPOs',
    subhead: 'Each client expects a different cut of the same operational data, while your analysts reconcile exports by hand. We turn those agreed reporting obligations into a controlled, repeatable workflow.',
    problemIntro: 'Client reporting is an obligation, not just a dashboard. The workflow must respect each program’s SLA language, confirm that every source arrived, and make a late or disputed number traceable before the report leaves your team.',
    symptoms: [
      'My analysts rebuild weekly packs for each account and spend the last hours checking totals against other exports.',
      'Clients question a service level number, but finding the source file and exact calculation takes another round of work.',
      'A missing file or changed column is discovered after delivery instead of during preparation.'
    ],
    approach: 'We use your existing ACD, CRM, and spreadsheet outputs, plus APIs where access allows. The work focuses on reconciliation, client-specific definitions, review, and distribution. It does not require replacing your contact center stack or selling another reporting platform.',
    deliverables: [
      { title: 'Reporting inventory', detail: 'Map each program’s sources, reporting calendar, recipients, SLA rules, and approval steps.' },
      { title: 'Reconciled data flow', detail: 'Combine exports or API data with Power Query, Apps Script, Python, or suitable connections and flag mismatches.' },
      { title: 'Client-specific outputs', detail: 'Generate the agreed tables, cuts, and notes for each client rather than forcing every program into one template.' },
      { title: 'Exception controls', detail: 'Identify late files, missing fields, and totals that require a human review before distribution.' },
      { title: 'Operating guide', detail: 'Document calculations, source lineage, execution steps, and handoff for the team that owns delivery.' }
    ],
    process: [
      'The free 30–45 minute assessment examines a sample reporting cycle, current packs, source exports, and approval requirements.',
      'We scope the programs, definitions, schedules, review rounds, and delivery boundaries in a proposal.',
      'We build against sample cycles, reconcile totals, and review exceptions with the people who sign off on client reporting.',
      'We hand over the workflow and documentation. Ongoing support begins at US$300/month if you need changes after delivery.'
    ],
    proof: 'Multi-client BPO operator: the published case reconciled 33,370 rows across 79 production weeks and consolidated fourteen telephony and CRM systems daily. SLA compliance moved from about 81% to over 99%, and more than 25 supervisor hours per week were freed. These are results from that case, not a forecast for a new engagement.',
    packageFit: 'Data Assessment (US$750, 2 weeks) clarifies sources and reporting obligations. Executive Cockpit starts at US$2,500 and includes a scoped automated reporting flow. Control Room starts at US$12,000 for broader integration work. We recommend a package only after examining your actual client packs.',
    faq: [
      { question: 'Can each client receive a report with its own SLA definitions?', answer: 'Yes, when the source data supports those definitions. We record the threshold, exclusions, time window, and program mapping for each client, then validate sample outputs with your account owners.' },
      { question: 'How do you reconcile numbers from multiple ACD and CRM exports?', answer: 'We map identifiers and reporting periods, compare totals, and expose unmatched or late records for review. The exact method depends on fields available in each system and how consistently they are populated.' },
      { question: 'Can weekly and monthly reports be scheduled automatically?', answer: 'Often, once inputs and approval rules are stable. We define when the workflow should run, what happens if data is late, and whether a person must approve a pack before it is sent.' },
      { question: 'Can the report show the source and calculation behind each KPI?', answer: 'That is part of the design. We document source fields and formulas and retain enough traceability for your team to investigate a disputed number, subject to the data your systems expose.' },
      { question: 'What happens when a source file is late or incomplete?', answer: 'The workflow should flag the issue and hold or label the affected output under an agreed rule. We decide with your team who reviews the exception and how a corrected report is issued.' }
    ]
  },
  {
    lang: 'en', slug: 'contact-center-qa-reporting', path: '/en/services/contact-center-qa-reporting/',
    title: 'Contact Center QA Reporting | Sagepoint',
    description: 'Turn QA scorecards into clear reporting on agent trends, rubric items, calibration and coaching. Built for contact center teams.',
    h1: 'Contact center QA scorecard reporting',
    subhead: 'Your evaluations contain useful patterns, but scattered scorecards make it hard to see which behaviors need coaching. We turn existing QA results into reporting that teams can inspect and discuss.',
    problemIntro: 'An average QA score can hide changes in the rubric, evaluator differences, and uneven sampling. We define the comparison rules before using score trends to guide coaching.',
    symptoms: [
      'I cannot see whether a low score comes from one rubric item or a broader agent trend.',
      'Different client programs use different forms, making a combined average misleading.',
      'Coaching notes and follow-up are disconnected from the evaluations that prompted them.'
    ],
    approach: 'We work with evaluations from your current QA platform or spreadsheets. We map rubric versions, score weights, evaluator and program identifiers, and agreed coaching outcomes. This is reporting on existing evaluations; call recording, automatic scoring, and QA platform replacement are outside this service.',
    deliverables: [
      { title: 'Scorecard inventory', detail: 'Map programs, rubric items, weights, versions, evaluators, and available coaching fields.' },
      { title: 'Comparable measures', detail: 'Define when agent, team, and rubric scores can be compared and where forms must remain separate.' },
      { title: 'QA reporting views', detail: 'Show trends and item-level patterns with filters for team, program, evaluator, and time where data allows.' },
      { title: 'Calibration checks', detail: 'Surface differences between evaluators when shared samples and identifiers support a comparison.' },
      { title: 'Coaching handoff', detail: 'Document measures and provide a way to review whether follow-up was recorded after an evaluation.' }
    ],
    process: [
      'A free 30–45 minute assessment reviews sample scorecards, exports, rubric changes, and coaching decisions.',
      'We agree on data access, comparable groups, metrics, review rounds, and a scoped deliverable.',
      'We reconcile sample evaluations, build views, and review surprising trends with QA leads.',
      'We hand over definitions, reporting instructions, and training. Ongoing Support starts at US$300/month for later changes.'
    ],
    validation: { title: 'How we validate QA data', detail: 'We compare report counts and score calculations with source evaluations, check rubric version and weighting, and flag missing evaluator or program identifiers. Calibration comparisons are shown only when the same work was reviewed by multiple evaluators under a comparable rubric.' },
    packageFit: 'Data Assessment (US$750, 2 weeks) helps clarify scorecards and source quality. Executive Cockpit starts at US$2,500 for a scoped reporting view over 4–6 weeks. The proposal depends on forms, history, and review needs.',
    faq: [
      { question: 'Can reports compare QA scores by agent, team and rubric item?', answer: 'Yes, if the evaluations include consistent agent, team, and item identifiers. We preserve rubric versions and show when a comparison would be misleading.' },
      { question: 'How do you handle different scorecards across client programs?', answer: 'We document each program’s items and weights, report them separately by default, and combine only measures that have an agreed common meaning.' },
      { question: 'Can we track calibration differences between evaluators?', answer: 'If evaluators scored shared samples under a comparable rubric, we can show differences by item or score. Without shared samples, we avoid treating score gaps as calibration evidence.' },
      { question: 'How can QA trends be linked to coaching follow-up?', answer: 'When coaching actions are recorded with agent and date fields, we can relate them to evaluation trends. The report shows follow-up status; it does not claim that a score change was caused by one coaching session.' },
      { question: 'Can existing spreadsheet evaluations be used as a data source?', answer: 'Yes. We inspect sample files for stable columns, IDs, dates, and rubric versions, then define a repeatable import and checks for missing or changed fields.' }
    ]
  },
  {
    lang: 'en', slug: 'contact-center-wfm-reporting', path: '/en/services/contact-center-wfm-reporting/',
    title: 'Contact Center WFM Reporting | Sagepoint',
    description: 'Track occupancy, schedule adherence, staffing gaps and interval performance with reports built from your contact center and WFM data.',
    h1: 'Contact center WFM and occupancy reporting',
    subhead: 'Staffing decisions need a shared view of scheduled time, actual states, and workload by interval. We connect your existing WFM and ACD outputs into reporting managers can verify.',
    problemIntro: 'Occupancy and adherence are easy to misread when systems use different intervals, state codes, or exclusions. Before charting a gap, we agree on the calculation and the source that supports it.',
    symptoms: [
      'Scheduled staffing and actual agent states live in separate exports.',
      'An occupancy number rises, but supervisors cannot see which intervals or queues drove it.',
      'Program managers debate adherence because breaks, offline work, and time zones are handled differently.'
    ],
    approach: 'We build reporting from the WFM, ACD, and spreadsheet data you already have. The work covers metric definitions, reconciliation, and interval views. It does not create schedules or replace your WFM software.',
    deliverables: [
      { title: 'Source and state map', detail: 'Document schedules, actual agent states, contact workload, intervals, time zones, and exclusions.' },
      { title: 'Metric definitions', detail: 'Agree on occupancy, adherence, and staffing gap formulas for each program and reporting period.' },
      { title: 'Interval reporting', detail: 'Show scheduled versus actual staffing and workload by interval where source granularity allows.' },
      { title: 'Reconciliation checks', detail: 'Flag missing schedules, state gaps, and late ACD data before managers use the report.' },
      { title: 'Operating guide', detail: 'Hand over calculation notes, refresh steps, and review guidance for supervisors.' }
    ],
    process: [
      'A free 30–45 minute assessment reviews current staffing decisions and sample WFM and ACD exports.',
      'We scope intervals, program mappings, measures, access, review rounds, and refresh needs.',
      'We reconcile records and test formulas with supervisors before finalizing the reporting views.',
      'We provide documentation and training. Ongoing Support starts at US$300/month if later changes are needed.'
    ],
    proof: 'Multi-client BPO operator: the published case consolidated data from fourteen telephony and CRM systems daily, with SLA compliance moving from about 81% to over 99%. It demonstrates cross-system operational reporting; the published case does not describe a WFM software implementation or prove an occupancy outcome.',
    packageFit: 'Data Assessment (US$750, 2 weeks) can clarify states and definitions. Executive Cockpit starts at US$2,500 for a scoped reporting view over 4–6 weeks. Control Room starts at US$12,000 over 10–14 weeks when broader data integration is required. Scope determines fit.',
    faq: [
      { question: 'How is occupancy calculated from our available data?', answer: 'We agree on which handling and available states count and inspect what your ACD exports provide. The report documents numerator, denominator, exclusions, and interval rules.' },
      { question: 'Can the report compare scheduled and actual staffing by interval?', answer: 'Yes, when schedule and actual-state data share reliable agent IDs, timestamps, and interval detail. We show gaps and flag missing records.' },
      { question: 'Can we report adherence across more than one program?', answer: 'Yes, if schedules, states, and program assignments can be mapped consistently. We retain program-specific rules rather than combining incompatible definitions.' },
      { question: 'How often can WFM and ACD data be refreshed?', answer: 'It depends on export or API access and source latency. We specify a feasible cadence and show when one feed is incomplete or late.' },
      { question: 'Can this work with our current WFM tool and spreadsheets?', answer: 'Usually, if the tool provides usable exports or API access and spreadsheets contain stable schedules or mappings. We assess those sources before committing to a build.' }
    ]
  }
];

export const HUBS = {
  es: { path: '/servicios/', title: 'Servicios de BI y automatización | Sagepoint', description: 'Dashboards, reportes y automatización de procesos para PYMEs en Guatemala. Explora servicios y agenda un diagnóstico gratuito.', h1: 'Servicios de datos y automatización para tu empresa', intro: 'Si tus decisiones dependen de archivos dispersos o tareas repetitivas, empezamos por entender el trabajo real. Construimos dashboards, reportes y flujos con alcance claro, revisión contigo y documentación para tu equipo.' },
  en: { path: '/en/services/', title: 'Reporting Services for Contact Centers | Sagepoint', description: 'Operational KPI dashboards and client reporting automation for US contact centers and BPOs. Built on your existing data and systems.', h1: 'Reporting services for contact centers and BPOs', intro: 'Your operations already generate data. We help turn existing ACD, CRM, and spreadsheet outputs into useful dashboards and repeatable client reporting, with agreed metric definitions and a documented handoff.' }
};

export const ALL_ROUTES = ['/', '/en/', '/portfolio/', '/en/portfolio/', '/web/', '/en/web/', HUBS.es.path, HUBS.en.path, ...SERVICES.map(service => service.path), '/guias/cuanto-cuesta-dashboard-power-bi-guatemala/'];
