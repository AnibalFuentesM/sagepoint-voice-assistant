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
    alert(validation.error); // Alert user immediately about config error
    return false;
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    // Usamos FormData estándar que funciona mejor con no-cors y GAS
    const formData = new FormData();
    formData.append('action', 'submit'); 
    
    for (const key in data) {
      formData.append(key, data[key]);
    }
    
    formData.append('timestamp', new Date().toISOString());
    formData.append('source', 'Sagepoint Web');

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log("✅ Datos enviados a Google Sheet (modo opaco)");
    return true;
  } catch (e: any) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      console.error("❌ Error: La solicitud excedió el tiempo de espera (10s).");
      // Even if it times out, in no-cors mode, it might have been sent. 
      // But we return false to trigger the error state in UI so user knows something happened.
      return false; 
    }
    console.error("❌ Error enviando datos a Google Sheet", e);
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