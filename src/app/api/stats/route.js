/**
 * GET /api/stats — statistiques globales pour le dashboard agence et les cartes de synthèse
 * de la page Contacts. Une erreur Supabase remonte en 503 : jamais de zéro silencieux (audit R18).
 */
import { NextResponse } from 'next/server';
import { api, HttpError } from '@/lib/api';
import { db } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function count(result) {
  if (result.error) throw new HttpError(503, 'Le service de données est indisponible. Réessayez ultérieurement.');
  return result.count || 0;
}

export const GET = api(async () => {
  const supa = db();

  const [
    clients, campaigns, sent, replies, reservations, optouts, failed, scheduled,
    contactsTotal, contactsConsent, contactsStop,
    // Le schéma actuel n'a pas de statut dédié "à vérifier" / "numéro invalide" : on
    // approxime avec les statuts existants les plus proches (voir docs/04-configuration-supabase.md).
    contactsUnverified, contactsInvalid,
  ] = await Promise.all([
    supa.from('clients').select('id', { count: 'exact', head: true }).eq('status', 'actif'),
    supa.from('campaigns').select('id', { count: 'exact', head: true }).in('status', ['programme', 'envoye']),
    supa.from('messages').select('id', { count: 'exact', head: true }).eq('direction', 'out')
      .in('status', ['sent', 'delivered', 'read', 'simulated']),
    supa.from('messages').select('id', { count: 'exact', head: true }).eq('direction', 'in'),
    supa.from('reservations').select('id', { count: 'exact', head: true }),
    supa.from('optouts').select('id', { count: 'exact', head: true }),
    supa.from('messages').select('id', { count: 'exact', head: true }).eq('direction', 'out').eq('status', 'failed'),
    supa.from('campaigns').select('id', { count: 'exact', head: true }).eq('status', 'programme'),
    supa.from('contacts').select('id', { count: 'exact', head: true }),
    supa.from('contacts').select('id', { count: 'exact', head: true }).eq('consent', true).eq('status', 'actif'),
    supa.from('contacts').select('id', { count: 'exact', head: true }).eq('status', 'stop'),
    supa.from('contacts').select('id', { count: 'exact', head: true }).eq('status', 'erreur'),
    supa.from('contacts').select('id', { count: 'exact', head: true }).eq('status', 'bloque'),
  ]);

  const toHandle = await supa.from('messages')
    .select('id, body, intent, created_at, contacts!messages_contact_id_fkey(first_name, last_name, phone), clients(name)')
    .eq('direction', 'in').eq('handled', false)
    .order('created_at', { ascending: false }).limit(10);
  if (toHandle.error) throw new HttpError(503, 'Le service de données est indisponible. Réessayez ultérieurement.');

  // Ces deux agrégats ont été ajoutés par la migration 006. Ils restent
  // facultatifs afin qu'un déploiement dont la migration n'est pas encore
  // appliquée conserve les KPI principaux au lieu de renvoyer une 503 globale.
  const configAlertsResult = await supa.from('clients').select('id, name')
    .eq('status', 'actif').is('wa_phone_number_id', null).limit(5);
  const configAlerts = configAlertsResult.error ? [] : (configAlertsResult.data || []);

  const weeklyResult = await supa.rpc('weekly_activity');
  const weekly = weeklyResult.error ? [] : (weeklyResult.data || []);

  return NextResponse.json({
    activeClients: count(clients),
    activeCampaigns: count(campaigns),
    scheduledCampaigns: count(scheduled),
    messagesSent: count(sent),
    repliesReceived: count(replies),
    reservations: count(reservations),
    optouts: count(optouts),
    sendErrors: count(failed),
    toHandle: toHandle.data || [],
    configAlerts,
    weeklyActivity: (weekly || []).map((w) => ({
      weekStart: w.week_start, sent: Number(w.sent), replies: Number(w.replies), reservations: Number(w.reservations),
    })),
    contacts: {
      total: count(contactsTotal),
      consenting: count(contactsConsent),
      optedOut: count(contactsStop),
      toVerify: count(contactsUnverified),
      invalid: count(contactsInvalid),
    },
  });
});
