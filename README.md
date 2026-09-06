# Sagepoint Analytics — Web

Landing page bilingüe (ES/EN) de Sagepoint Analytics: paquetes productizados de inteligencia de negocios para PYMEs en Guatemala y EE. UU.

Stack: Vite + React 19 + Tailwind compilado + react-router-dom. Deploy en Vercel.

## Correr localmente

**Prerrequisitos:** Node.js

1. Instalar dependencias: `npm install`
2. Correr la app: `npm run dev` (puerto 3000)
3. Build de producción: `npm run build` · Preview: `npm run preview`

## Configuración

- **Formulario de contacto**: envía a Google Sheets vía Apps Script (`GOOGLE_SCRIPT_URL` en `constants.ts`).
- **Google Analytics 4**: define `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` en `.env.local` para desarrollo y en Vercel para producción. La web captura `page_view`, `select_package`, `lead_form_open`, `lead_submit_attempt`, `generate_lead`, `lead_delivery_unconfirmed`, `lead_submit_failed` y `whatsapp_click`. En producción ya existe el ID de respaldo `G-F296ZSRJ2Z`; en desarrollo queda desactivado salvo configuración explícita.
- **Atribución de leads**: los parámetros de la campaña más reciente se guardan localmente y se envían con el formulario (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, página de entrada y referente).


## Conversión y HTML publicado

- El formulario hace un solo POST. Solo JSON con `success: true` o `status: "success"` confirma recepción; una respuesta ambigua muestra pendiente y nunca se reenvía automáticamente. El contexto se conserva para todos los paquetes. El backend de Apps Script debe confirmar después de guardar: ver [plan comercial](docs/plan-marketing.md).
- `npm run build` renderiza los componentes React en HTML ES/EN para las tres rutas públicas y genera el sitemap. Las variantes inglesas se sirven con `?lang=en` mediante las reglas de `vercel.json`; el preview local reproduce esas reglas.
- La carpeta `private/` contiene material excluido de publicación; no se copia a `dist`. La salida que se despliega es exclusivamente `dist`.
- Validación: `npm run build` y `node --test tests/sales-regressions.test.mjs`. Los tests simulan el backend y no crean leads reales.
- [Evidencia pendiente y borradores comerciales](docs/prueba-social-y-borradores.md). No hay automatizaciones activadas ni mensajes enviados.

## Revisión de publicación (septiembre de 2026)

Consulta [la auditoría y pendientes](docs/audit-2026-09-05.md). `npm run build` también bloquea texto y nombres de assets excluidos mediante `scripts/check-public-output.mjs`; los PDFs e imágenes requieren revisión manual. `npm test` ejecuta las regresiones después del build.

`vercel.json` es la fuente de configuración: build explícito, salida `dist` y rutas inglesas antes de archivos estáticos. No reemplazarlo por las reglas históricas de un staging temporal. El preview Vite reproduce HTML por idioma, pero no prueba redirecciones, caché ni HTTP 404 de Vercel. Antes de publicar, validar esas reglas en la plataforma. Los cambios de esta auditoría todavía no están desplegados.
