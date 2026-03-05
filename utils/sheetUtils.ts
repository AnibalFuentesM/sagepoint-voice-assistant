import { GOOGLE_SCRIPT_URL } from '../constants';

// Define the structure of a FAQ item
export interface FAQItem {
  question: string;
  answer: string;
}

function validateScriptUrl(url: string): { valid: boolean; error?: string } {
  if (!url) return { valid: false, error: "URL no definida" };
  if (url.includes('PLACEHOLDER') || url.includes('REEMPLAZA_ESTO')) return { valid: false, error: "URL es un placeholder" };
  if (!url.includes('script.google.com')) return { valid: false, error: "No es una URL de Google Script" };

  // Check for common mistake: Editor URL instead of Exec URL
  if (url.includes('/edit') || url.includes('/projects/') || url.includes('/home/')) {
    return {
      valid: false,
      error: "⚠️ Has puesto la URL del EDITOR de Apps Script. Debes usar la URL de la IMPLEMENTACIÓN (Web App) que termina en '/exec'."
    };
  }

  return { valid: true };
}

export async function submitToGoogleSheet(data: Record<string, string>) {
  const validation = validateScriptUrl(GOOGLE_SCRIPT_URL);

  if (!validation.valid) {
    console.error("❌ ERROR DE CONFIGURACIÓN:", validation.error);
    alert(validation.error);
    return false;
  }

  // Build URL-encoded params (GAS reads via e.parameter)
  const params = new URLSearchParams();
  params.append('action', 'submit');
  for (const key in data) {
    params.append(key, data[key]);
  }
  params.append('timestamp', new Date().toISOString());
  params.append('source', 'Sagepoint Web');

  // Attempt 1: Standard fetch with redirect follow (handles GAS 302 redirects)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: params,
      redirect: 'follow',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log("✅ Datos enviados a Google Sheet (cors, redirect follow)", response.status);
    return true;
  } catch (corsError: any) {
    console.warn("⚠️ Intento CORS falló, intentando no-cors...", corsError.message || corsError.name);
  }

  // Attempt 2: Fallback to no-cors (fire-and-forget, no AbortController)
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: params,
      mode: 'no-cors'
    });
    console.log("✅ Datos enviados a Google Sheet (fallback no-cors)");
    return true;
  } catch (fallbackError) {
    console.error("❌ Error en ambos intentos de envío", fallbackError);
    return false;
  }
}

export async function fetchKnowledgeBase(): Promise<FAQItem[]> {
  const validation = validateScriptUrl(GOOGLE_SCRIPT_URL);

  if (!validation.valid) {
    console.warn("⚠️ No se pueden cargar FAQs:", validation.error);
    return [];
  }

  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getFaqs`, {
      method: 'GET',
      redirect: 'follow'
    });

    if (!response.ok) {
      // Si el servidor devuelve HTML (común en errores de URL incorrecta), lanzamos error
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error("La URL devolvió HTML en lugar de JSON. Verifica constants.ts");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data as FAQItem[];
    }

    return [];
  } catch (e) {
    console.error("Error obteniendo FAQs desde Google Sheet", e);
    return [];
  }
}