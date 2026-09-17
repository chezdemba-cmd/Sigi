import 'server-only';
import { db } from '@/lib/supabase';
import { checked } from '@/lib/api';

/** Lecture d'un réglage clé/valeur (table `settings`, déjà utilisée par le planificateur). */
export async function getSetting(key) {
  const row = checked(await db().from('settings').select('value').eq('key', key).maybeSingle());
  return row?.value ?? null;
}

export async function setSetting(key, value) {
  checked(await db().from('settings').upsert({ key, value: String(value), updated_at: new Date().toISOString() }));
}

/** Mode Démo global : prioritaire sur `DEMO_MODE` s'il a été défini explicitement depuis l'UI. */
export async function getDemoGlobal() {
  const value = await getSetting('demo_mode_global');
  if (value === null) return process.env.DEMO_MODE !== 'false';
  return value === 'true';
}
