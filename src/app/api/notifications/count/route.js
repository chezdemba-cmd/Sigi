import { NextResponse } from 'next/server';
import { api, HttpError } from '@/lib/api';
import { db } from '@/lib/supabase';

/** Compteur léger pour la cloche de la TopBar — réponses entrantes non traitées. */
export const GET = api(async () => {
  const { count, error } = await db().from('messages').select('id', { count: 'exact', head: true })
    .eq('direction', 'in').eq('handled', false);
  if (error) throw new HttpError(503, 'Le service de données est indisponible. Réessayez ultérieurement.');
  return NextResponse.json({ count: count ?? 0 });
});
