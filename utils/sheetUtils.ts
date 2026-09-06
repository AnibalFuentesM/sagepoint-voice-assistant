import { GOOGLE_SCRIPT_URL } from '../constants';

export type SubmitResult = 'confirmed' | 'unconfirmed' | false;

/** Only an explicit acknowledgement is evidence of receipt. HTML/empty 200s are not. */
export function interpretLeadResponse(body: string): SubmitResult {
  try {
    const reply = JSON.parse(body);
    if (!reply || typeof reply !== 'object' || Array.isArray(reply)) return 'unconfirmed';
    if (reply.error || reply.success === false || reply.status === 'error') return false;
    if (reply.success === true || reply.status === 'success') return 'confirmed';
  } catch {
    // Apps Script can return an HTML login/error page with HTTP 200.
  }
  return 'unconfirmed';
}

export async function submitToGoogleSheet(data: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const url = new URL(GOOGLE_SCRIPT_URL);
    if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !url.pathname.endsWith('/exec')) return false;
  } catch {
    return false;
  }

  const params = new URLSearchParams({ action: 'submit' });
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) params.append(key, String(value));
  }
  params.set('timestamp', new Date().toISOString());
  params.set('source', 'Sagepoint Web');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST', body: params, redirect: 'follow', signal: controller.signal,
    });
    // A server error may happen after the row was saved. Do not resend blindly.
    if (!response.ok) return 'unconfirmed';
    return interpretLeadResponse(await response.text());
  } catch {
    // A timeout/CORS error says nothing about whether the POST was processed.
    // A second no-cors POST could create a duplicate lead, so never auto-retry.
    return 'unconfirmed';
  } finally {
    clearTimeout(timeout);
  }
}
