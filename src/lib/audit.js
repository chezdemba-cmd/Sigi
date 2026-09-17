import 'server-only';
import { db } from '@/lib/supabase';

/**
 * Journal d'audit — alimente le bloc "Journal d'audit" de /parametres et le widget
 * "Activité récente" du dashboard. Ne doit jamais faire échouer l'action auditée :
 * une écriture de log manquée est acceptable, une action métier cassée ne l'est pas.
 */
export async function logAudit(actor, action, detail = null, clientId = null) {
  try {
    await db().from('audit_logs').insert({ actor, action, detail, client_id: clientId });
  } catch (error) {
    console.error(JSON.stringify({ event: 'audit_log_failed', action, message: error?.message }));
  }
}
