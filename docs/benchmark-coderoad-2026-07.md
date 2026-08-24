# Benchmark: coderoad.com → Sagepoint Analytics

Fecha: 2026-07-30
Fuente: https://coderoad.com/ (homepage + estructura de navegación)
Comparado contra: `sagepoint-web` (landing única + `/portfolio`)

---

## Resumen

CodeRoad es una consultora nearshore de ~$XXM que lleva 20+ años vendiendo lo mismo que tú vendes (ejecución técnica externa), solo a empresas más grandes. Su web está construida como **máquina de captación B2B**, no como brochure. Lo que hacen bien es casi todo estructural, no visual.

**Su gran debilidad:** cero precios, cero plazos, copy lleno de jerga ("Velocity-as-a-Service™", "execution friction"). Ahí tú ya les ganas. No copies eso.

---

## Lo que hacen bien (y qué implementar)

### 🔴 Prioridad alta — impacto directo en leads

**1. Metodología con nombre propio**
CodeRoad no vende "desarrollo nearshore", vende **Velocity-as-a-Service™**. Todo el sitio lo repite. Un nombre convierte un servicio commodity en propiedad intelectual.

→ Tú ya tienes el concepto: *Soporte Cercano + Human-in-the-Loop*. Falta empaquetarlo como método con nombre, 3–4 pasos y una página propia. Ej: "Método Sagepoint: Diagnóstico → Modelo → Automatización → Coaching".

**2. Booking directo, no formulario**
Su CTA único en toda la página es **"Book a Strategy Session"** → `/calendar`. Un solo verbo, repetido 5+ veces, siempre al mismo destino.

→ Hoy tu CTA va a un formulario → Google Sheets. Añade Cal.com o Google Calendar Appointments embebido. Un formulario pierde entre 40–60% de intención vs. agendar en el momento.

**3. Resultados cuantificados en el título del caso**
Sus casos se llaman: *"How CodeRoad unlocked $36M in revenue via CI/CD modernization"*, *"4x faster iterations"*, *"restored 100% reporting reliability"*.

→ Tus casos hoy son descriptivos ("Automatización con Python y Playwright..."). Reescríbelos con el número al frente:
- "Cómo eliminamos 12 h/semana de exportaciones manuales en Zendesk Talk"
- "Cómo automatizamos alertas de ECW y reducimos el tiempo de respuesta a X min"

**4. Bloque de credibilidad en números**
Sección dedicada: *20+ años · NPS 66.67 · 80% de clientes retenidos 5+ años*.

→ Tus métricas de hero (80% ahorro, +20% ventas) están sueltas. Crea una sección "Sagepoint en números" con lo que sí puedas probar: proyectos entregados, fuentes de datos integradas, horas/mes ahorradas a clientes, países atendidos.

**5. Prueba social visible desde el segundo scroll**
30+ logos de clientes justo bajo el hero (Samsung, Ford, GM, Chanel...). Es lo primero que ve el visitante después del título.

→ Tienes 2 testimonios enterrados abajo y cero logos. Opciones si no puedes usar logos de clientes:
- Logos de **herramientas** que dominas (Power BI, Looker Studio, Python, Zendesk, Google Cloud) — es lo que hace la mayoría de consultores solos
- Logos de clientes con autorización, aunque sean 3
- Subir los testimonios más arriba, justo después de servicios

---

### 🟡 Prioridad media — SEO y volumen de tráfico

**6. Arquitectura de páginas por problema × industria**
Su nav tiene 3 ejes: **Metodología** (5 páginas), **Retos** (8 páginas), **Industrias** (8 páginas). Cada URL es una landing indexable para una búsqueda específica ("legacy modernization", "databricks implementation", "healthtech").

→ Tú tienes 1 página. Es tu mayor limitante de tráfico orgánico. Empieza con 3–5 landings, no 20:
- `/dashboards-power-bi` · `/automatizacion-de-reportes` · `/modelos-predictivos`
- `/inteligencia-de-negocios-guatemala` (geo, alto intento)
- Luego por industria: retail, clínicas/salud, distribución/logística

**7. Motor de contenido: Blog + Recursos descargables**
Blog (SEO) + Resources con eBooks y Use Cases, ambos **filtrables por industria y tema**. Los eBooks son imanes de leads ("Download our Agentic Playbook").

→ Implementa en dos fases:
- Fase 1: un eBook/checklist descargable a cambio de email. Ej: *"Checklist: 12 señales de que tus reportes te están costando dinero"*. Alimenta tu lista y justifica el newsletter.
- Fase 2: blog con 1 post/mes atacando keywords long-tail en español.

**8. Captura de email en el footer (newsletter)**
Todo visitante que no está listo para agendar sigue siendo capturable.

→ Añade un campo de email en tu footer. Costo bajísimo, recupera el 95% que no convierte hoy.

**9. FAQ larga y conversacional**
Sus 7 respuestas son de 2–3 párrafos, escritas para que un LLM las cite. Esto es SEO para ChatGPT/Perplexity, no solo Google.

→ Tu FAQ ya es buena pero corta. Expande las respuestas y **añade schema `FAQPage`** en JSON-LD (ya tienes `llms.txt`, esto va en la misma línea).

**10. Lista de verticales keyword-rich**
Sección simple con: SaaS, PaaS, Retail, Automotive, Supply Chain, Manufacturing, FinTech, HealthTech, Banking, Aviation, "& More".

→ Barato de implementar, cubre muchas búsquedas y le dice al visitante "sí, trabajamos con tu industria".

---

### 🟢 Prioridad baja — confianza y pulido

**11. Badges de seguridad/compliance en el footer**
SOC 2 e ISO 27001 con badge visual. En su copy: *"SOC2, HIPAA, and PCI-DSS baked into the architecture from line one"*.

→ Tú manejas datos financieros y operativos de PYMEs — la objeción "¿mis datos están seguros?" es real y no la estás respondiendo. No necesitas certificarte: añade una sección corta de **manejo de datos** (NDA firmado, acceso mínimo necesario, datos nunca salen de tus sistemas, borrado al cerrar proyecto). Bajo costo, quita un freno grande.

**12. Video de fondo en el hero**
`hero-sequence-dark.mp4` a pantalla completa.

→ Tú ya tienes `HeroScene` (3D). Igual de bueno o mejor. **No cambies nada aquí.** Solo verifica peso y LCP en móvil.

**13. Tres modelos de contratación explícitos**
Staff Augmentation / Dedicated Teams / Turnkey, cada uno con: promesa en 3 palabras ("Fill gaps fast"), párrafo, y **3 enlaces internos** a páginas de servicio.

→ Tus 4 paquetes ya cubren esto. Lo que falta son los **enlaces internos** desde cada paquete hacia páginas de detalle (que aún no existen — depende del punto 6).

**14. Claim de escala geográfica**
*"14 países en LATAM, operaciones alineadas al horario de EE. UU."*

→ Tú tienes el mismo ángulo (Guatemala + EE. UU., mismo huso horario que clientes gringos) pero está diluido. Conviértelo en un beneficio explícito con mapa o bloque propio: *"Tu analista en tu horario, no a 12 horas de distancia."*

---

## Lo que NO copiar

| Lo que hace CodeRoad | Por qué no |
|---|---|
| Cero precios en todo el sitio | Tus precios visibles ($750 / $2,500) y el "No incluye" son tu mayor diferenciador. Es exactamente lo contrario de una consultora, y es lo que un dueño de PYME necesita. |
| Jerga corporativa densa | "Removes execution friction across the SDLD" no funciona con un gerente de PYME en Guatemala. Tu copy directo es una ventaja. |
| Trademark en todo (™) | Nombra tu método, pero sin sobrecargarlo. |
| Nav de 4 niveles con 25+ links | Con 5 páginas no necesitas mega-menú. Escala la nav cuando escale el contenido. |

---

## Orden sugerido de ejecución

| # | Acción | Esfuerzo | Impacto |
|---|---|---|---|
| 1 | Booking directo (Cal.com) reemplazando/complementando el form | Bajo | Alto |
| 2 | Casos reescritos con número al frente | Bajo | Alto |
| 3 | Logos (herramientas o clientes) bajo el hero | Bajo | Alto |
| 4 | Sección "Sagepoint en números" | Bajo | Medio |
| 5 | Email capture en footer | Bajo | Medio |
| 6 | Sección de manejo de datos / confidencialidad | Bajo | Medio |
| 7 | Schema FAQPage + FAQ expandida | Bajo | Medio (SEO/LLM) |
| 8 | Nombrar y documentar el método (página propia) | Medio | Alto |
| 9 | 3–5 landings por servicio y geo | Alto | Alto (SEO) |
| 10 | eBook/checklist descargable | Medio | Alto (leads) |
| 11 | Blog con cadencia mensual | Alto | Alto a largo plazo |
