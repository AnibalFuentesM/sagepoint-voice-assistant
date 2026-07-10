# Sagepoint Analytics — Web

Landing page bilingüe (ES/EN) de Sagepoint Analytics: paquetes productizados de inteligencia de negocios para PYMEs en Guatemala y EE. UU.

Stack: Vite + React 19 + Tailwind (CDN) + react-router-dom. Deploy en Vercel.

## Correr localmente

**Prerrequisitos:** Node.js

1. Instalar dependencias: `npm install`
2. Correr la app: `npm run dev` (puerto 3000)
3. Build de producción: `npm run build` · Preview: `npm run preview`

## Configuración

- **Formulario de contacto**: envía a Google Sheets vía Apps Script (`GOOGLE_SCRIPT_URL` en `constants.ts`).
- **Google Analytics 4**: reemplaza `G-XXXXXXXXXX` en `index.html` con tu Measurement ID real.
