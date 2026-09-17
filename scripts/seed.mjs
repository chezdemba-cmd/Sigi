import { createClient } from '@supabase/supabase-js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(path.join(dir, '..', '.env.local'));
} catch (e) {
  console.error('Erreur chargement .env.local:', e.message);
}

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('1. Insertion des clients de démonstration...');
  const clients = [
    { id: '11111111-1111-4111-a111-111111111111', name: 'Chez Demba', sector: 'restaurant', city: 'Angers', whatsapp_phone: '+33612340001', status: 'actif', tone: 'chaleureux', demo_mode: true },
    { id: '22222222-2222-4222-a222-222222222222', name: 'Salon Belle Époque', sector: 'beaute', city: 'Angers', whatsapp_phone: '+33612340002', status: 'actif', tone: 'premium', demo_mode: true },
    { id: '33333333-3333-4333-a333-333333333333', name: 'Boutique Wax & Style', sector: 'commerce', city: 'Nantes', whatsapp_phone: '+33612340003', status: 'actif', tone: 'jeune', demo_mode: true },
    { id: '44444444-4444-4444-a444-444444444444', name: 'Association Teranga 49', sector: 'association', city: 'Angers', whatsapp_phone: '+33612340004', status: 'actif', tone: 'communautaire', demo_mode: true },
    { id: '55555555-5555-4555-a555-555555555555', name: 'Kaay Fecc Events', sector: 'evenementiel', city: 'Paris', whatsapp_phone: '+33612340005', status: 'actif', tone: 'jeune', demo_mode: true }
  ];
  const { error: errC } = await supa.from('clients').upsert(clients, { onConflict: 'id' });
  if (errC) { console.error('Erreur clients:', errC.message); return; }
  console.log('✓ 5 clients créés.');

  console.log('2. Insertion des contacts...');
  const contacts = [
    { client_id: '11111111-1111-4111-a111-111111111111', first_name: 'Awa', last_name: 'Diallo', phone: '+33612345001', category: 'vip', city: 'Angers', consent: true, consent_source: 'carte fidélité', status: 'actif' },
    { client_id: '11111111-1111-4111-a111-111111111111', first_name: 'Moussa', last_name: 'Traoré', phone: '+33612345002', category: 'sport', city: 'Angers', consent: true, consent_source: 'soirée match janvier', status: 'actif' },
    { client_id: '11111111-1111-4111-a111-111111111111', first_name: 'Fatou', last_name: 'Ndiaye', phone: '+33612345003', category: 'clients_habitues', city: 'Angers', consent: true, consent_source: 'carte fidélité', status: 'actif' },
    { client_id: '11111111-1111-4111-a111-111111111111', first_name: 'Ibrahim', last_name: 'Koné', phone: '+33612345004', category: 'sport', city: 'Angers', consent: true, consent_source: 'inscription WhatsApp comptoir', status: 'actif' },
    { client_id: '11111111-1111-4111-a111-111111111111', first_name: 'Aminata', last_name: 'Cissé', phone: '+33612345005', category: 'vip', city: 'Angers', consent: true, consent_source: 'carte fidélité', status: 'actif' },
    { client_id: '11111111-1111-4111-a111-111111111111', first_name: 'Jean', last_name: 'Martin', phone: '+33612345006', category: 'clients_habitues', city: 'Angers', consent: true, consent_source: 'carte fidélité', status: 'actif' },
    { client_id: '22222222-2222-4222-a222-222222222222', first_name: 'Chloé', last_name: 'Dubois', phone: '+33612345011', category: 'clients_habitues', city: 'Angers', consent: true, consent_source: 'fiche cliente', status: 'actif' },
    { client_id: '22222222-2222-4222-a222-222222222222', first_name: 'Mariam', last_name: 'Sow', phone: '+33612345012', category: 'vip', city: 'Angers', consent: true, consent_source: 'fiche cliente', status: 'actif' },
    { client_id: '22222222-2222-4222-a222-222222222222', first_name: 'Léa', last_name: 'Bernard', phone: '+33612345013', category: 'beaute', city: 'Angers', consent: true, consent_source: 'prise de RDV en ligne', status: 'actif' },
    { client_id: '22222222-2222-4222-a222-222222222222', first_name: 'Sophie', last_name: 'Petit', phone: '+33612345014', category: 'clients_habitues', city: 'Angers', consent: true, consent_source: 'fiche cliente', status: 'actif' },
    { client_id: '33333333-3333-4333-a333-333333333333', first_name: 'Aïcha', last_name: 'Bamba', phone: '+33612345021', category: 'vip', city: 'Nantes', consent: true, consent_source: 'programme fidélité', status: 'actif' },
    { client_id: '33333333-3333-4333-a333-333333333333', first_name: 'Nadia', last_name: 'Benali', phone: '+33612345022', category: 'clients_habitues', city: 'Nantes', consent: true, consent_source: 'achat en boutique', status: 'actif' },
    { client_id: '33333333-3333-4333-a333-333333333333', first_name: 'Grace', last_name: 'Okafor', phone: '+33612345023', category: 'vip', city: 'Nantes', consent: true, consent_source: 'programme fidélité', status: 'actif' },
    { client_id: '33333333-3333-4333-a333-333333333333', first_name: 'Emma', last_name: 'Leroy', phone: '+33612345024', category: 'prospects', city: 'Nantes', consent: true, consent_source: 'jeu concours Instagram', status: 'actif' },
    { client_id: '44444444-4444-4444-a444-444444444444', first_name: 'Ousmane', last_name: 'Fall', phone: '+33612345031', category: 'association', city: 'Angers', consent: true, consent_source: 'adhésion 2026', status: 'actif' },
    { client_id: '44444444-4444-4444-a444-444444444444', first_name: 'Khady', last_name: 'Sarr', phone: '+33612345032', category: 'association', city: 'Angers', consent: true, consent_source: 'adhésion 2026', status: 'actif' },
    { client_id: '44444444-4444-4444-a444-444444444444', first_name: 'Mamadou', last_name: 'Ba', phone: '+33612345033', category: 'famille', city: 'Angers', consent: true, consent_source: 'adhésion 2026', status: 'actif' },
    { client_id: '55555555-5555-4555-a555-555555555555', first_name: 'Binta', last_name: 'Camara', phone: '+33612345041', category: 'evenementiel', city: 'Paris', consent: true, consent_source: 'billetterie soirée mars', status: 'actif' },
    { client_id: '55555555-5555-4555-a555-555555555555', first_name: 'Sékou', last_name: 'Doumbia', phone: '+33612345042', category: 'etudiants', city: 'Paris', consent: true, consent_source: 'billetterie soirée mars', status: 'actif' },
    { client_id: '55555555-5555-4555-a555-555555555555', first_name: 'Yasmine', last_name: 'Haddad', phone: '+33612345043', category: 'vip', city: 'Paris', consent: true, consent_source: 'liste VIP promoteur', status: 'actif' }
  ];
  const { error: errCt } = await supa.from('contacts').upsert(contacts, { onConflict: 'client_id,phone' });
  if (errCt) { console.error('Erreur contacts:', errCt.message); return; }
  console.log('✓ 20 contacts créés.');

  console.log('3. Insertion des campagnes...');
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);

  const campaigns = [
    {
      client_id: '11111111-1111-4111-a111-111111111111',
      name: "Match Côte d'Ivoire vs Sénégal",
      type: 'evenement',
      event_at: new Date(weekStart.getTime() + 5 * 86400000 + 22 * 3600000).toISOString(),
      send_at: new Date(weekStart.getTime() + 3 * 86400000 + 18 * 3600000).toISOString(),
      reminder_hours: 12,
      reminder_at: new Date(weekStart.getTime() + 5 * 86400000 + 10 * 3600000).toISOString(),
      offer: 'Garba Thon 10 €',
      location: 'Chez Demba, Angers',
      target_categories: ['sport', 'vip', 'clients_habitues'],
      message_main: "Bonjour {{prenom}} 👋\nChez Demba vous invite : Match Côte d'Ivoire vs Sénégal ce samedi à 22h sur grand écran ! 🍽️\n✨ Garba Thon 10 €\n📍 Chez Demba, Angers\nRépondez OUI pour réserver votre table.\nRépondez STOP pour ne plus recevoir nos messages.",
      message_reminder: "Bonjour {{prenom}} 👋\nPetit rappel : le match Côte d'Ivoire vs Sénégal commence dans 12h ! ⚽\n📍 Chez Demba, Angers\nRépondez RÉSERVE si vous voulez une table.\nRépondez STOP pour ne plus recevoir nos messages.",
      status: 'brouillon'
    },
    {
      client_id: '22222222-2222-4222-a222-222222222222',
      name: 'Offre week-end coiffure',
      type: 'promotion',
      event_at: new Date(weekStart.getTime() + 4 * 86400000 + 10 * 3600000).toISOString(),
      send_at: new Date(weekStart.getTime() + 2 * 86400000 + 10 * 3600000).toISOString(),
      reminder_hours: 24,
      reminder_at: new Date(weekStart.getTime() + 3 * 86400000 + 10 * 3600000).toISOString(),
      offer: '-20 % sur les prestations coiffure',
      location: 'Salon Belle Époque, Angers',
      target_categories: ['clients_habitues', 'vip', 'beaute'],
      message_main: "Bonjour {{prenom}} 👋\nLe Salon Belle Époque vous propose une offre exclusive ce week-end : -20 % sur les prestations coiffure. ✨\n📍 Salon Belle Époque, Angers\nRépondez OUI pour prendre rendez-vous.\nRépondez STOP pour ne plus recevoir nos messages.",
      message_reminder: "Bonjour {{prenom}} 👋\nDernières places pour l'offre -20 % de ce week-end !\nRépondez OUI pour réserver votre créneau.\nRépondez STOP pour ne plus recevoir nos messages.",
      status: 'brouillon'
    },
    {
      client_id: '33333333-3333-4333-a333-333333333333',
      name: 'Nouvel arrivage collection wax',
      type: 'lancement_produit',
      event_at: new Date(weekStart.getTime() + 5 * 86400000 + 11 * 3600000).toISOString(),
      send_at: new Date(weekStart.getTime() + 4 * 86400000 + 11 * 3600000).toISOString(),
      reminder_hours: 12,
      reminder_at: new Date(weekStart.getTime() + 4 * 86400000 + 23 * 3600000).toISOString(),
      offer: 'Nouvelle collection en avant-première pour nos VIP',
      location: 'Wax & Style, Nantes',
      target_categories: ['vip'],
      message_main: "Bonjour {{prenom}} 👋\nLa nouvelle collection wax arrive samedi chez Wax & Style ! 🛍️\n✨ Avant-première réservée à nos clientes VIP dès 11h.\n📍 Wax & Style, Nantes\nRépondez INFO pour plus de détails.\nRépondez STOP pour ne plus recevoir nos messages.",
      message_reminder: "Bonjour {{prenom}} 👋\nC'est demain 11h : avant-première de la nouvelle collection ! 🛍️\n📍 Wax & Style, Nantes\nRépondez STOP pour ne plus recevoir nos messages.",
      status: 'brouillon'
    },
    {
      client_id: '44444444-4444-4444-a444-444444444444',
      name: 'Réunion communautaire + repas partagé',
      type: 'invitation',
      event_at: new Date(weekStart.getTime() + 6 * 86400000 + 15 * 3600000).toISOString(),
      send_at: new Date(weekStart.getTime() + 4 * 86400000 + 12 * 3600000).toISOString(),
      reminder_hours: 24,
      reminder_at: new Date(weekStart.getTime() + 5 * 86400000 + 15 * 3600000).toISOString(),
      offer: 'Réunion suivie d\'un repas partagé',
      location: 'Salle des fêtes, Angers',
      target_categories: ['association', 'famille'],
      message_main: "Bonjour {{prenom}} 👋\nL'Association Teranga 49 vous invite à sa réunion communautaire dimanche à 15h, suivie d'un repas partagé. 🤝\n📍 Salle des fêtes, Angers\nRépondez OUI si vous serez présent(e).\nRépondez STOP pour ne plus recevoir nos messages.",
      message_reminder: "Bonjour {{prenom}} 👋\nRappel : réunion + repas partagé demain 15h. On compte sur vous ! 🤝\n📍 Salle des fêtes, Angers\nRépondez STOP pour ne plus recevoir nos messages.",
      status: 'brouillon'
    },
    {
      client_id: '55555555-5555-4555-a555-555555555555',
      name: 'Soirée Afro — entrée sur réservation',
      type: 'evenement',
      event_at: new Date(weekStart.getTime() + 5 * 86400000 + 23 * 3600000).toISOString(),
      send_at: new Date(weekStart.getTime() + 3 * 86400000 + 19 * 3600000).toISOString(),
      reminder_hours: 12,
      reminder_at: new Date(weekStart.getTime() + 5 * 86400000 + 11 * 3600000).toISOString(),
      offer: 'Entrée sur réservation uniquement',
      location: 'Le Warehouse, Paris',
      target_categories: ['evenementiel', 'vip', 'etudiants'],
      message_main: "Bonjour {{prenom}} 👋\nKaay Fecc Events présente la Soirée Afro ce samedi à 23h ! 🎶\n✨ Entrée sur réservation uniquement.\n📍 Le Warehouse, Paris\nRépondez RÉSERVE pour garantir votre place.\nRépondez STOP pour ne plus recevoir nos messages.",
      message_reminder: "Bonjour {{prenom}} 👋\nC'est ce soir ! Soirée Afro à 23h — dernières places. 🎶\n📍 Le Warehouse, Paris\nRépondez RÉSERVE maintenant.\nRépondez STOP pour ne plus recevoir nos messages.",
      status: 'brouillon'
    }
  ];

  // Vérifie si des campagnes existent déjà pour éviter les doublons
  const { data: existing } = await supa.from('campaigns').select('id').limit(1);
  if (!existing || existing.length === 0) {
    const { error: errCp } = await supa.from('campaigns').insert(campaigns);
    if (errCp) { console.error('Erreur campagnes:', errCp.message); return; }
    console.log('✓ 5 campagnes d\'exemple créées.');
  } else {
    console.log('· Des campagnes existent déjà, insertion ignorée.');
  }

  console.log('\n★ Données de démonstration prêtes avec succès !');
}

main().catch(err => {
  console.error('Échec du seed:', err);
  process.exitCode = 1;
});
