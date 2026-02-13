# Configurar Variable de Entorno en Vercel

Para que el asistente de voz funcione en producción, necesitas agregar la API Key de Gemini como variable de entorno en Vercel.

## Pasos:

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Haz clic en tu proyecto **"sagepoint-voice-assistant"**
3. Ve a la pestaña **"Settings"** (Configuración)
4. En el menú lateral, selecciona **"Environment Variables"**
5. Haz clic en **"Add New"** o **"Add"**
6. Configura:
   - **Name (Nombre)**: `GEMINI_API_KEY`
   - **Value (Valor)**: `AIzaSyA5D13nhD6qvJHglG2Ww7mJrQjuggmY33E`
   - **Environment**: Selecciona todas (Production, Preview, Development)
7. Haz clic en **"Save"**
8. Ve a la pestaña **"Deployments"**
9. Haz clic en el último despliegue y selecciona **"Redeploy"** para que tome la nueva variable

¡Listo! Después de esto, el asistente funcionará correctamente en producción.
