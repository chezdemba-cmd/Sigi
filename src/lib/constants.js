/** Constantes partagées front/back (pas de secret ici). */

export const SECTORS = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bar', label: 'Bar' },
  { value: 'commerce', label: 'Commerce / Boutique' },
  { value: 'beaute', label: 'Salon de coiffure / beauté' },
  { value: 'evenementiel', label: 'Artiste / Événementiel' },
  { value: 'association', label: 'Association' },
  { value: 'pme', label: 'PME / PMI' },
];

export const TONES = [
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'chaleureux', label: 'Chaleureux' },
  { value: 'jeune', label: 'Jeune' },
  { value: 'premium', label: 'Premium' },
  { value: 'communautaire', label: 'Communautaire' },
];

export const CONTACT_CATEGORIES = [
  { value: 'vip', label: 'VIP' },
  { value: 'clients_habitues', label: 'Clients habitués' },
  { value: 'prospects', label: 'Prospects' },
  { value: 'restauration', label: 'Restauration' },
  { value: 'evenementiel', label: 'Événementiel' },
  { value: 'sport', label: 'Sport / Match' },
  { value: 'beaute', label: 'Beauté' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'association', label: 'Association' },
  { value: 'partenaires', label: 'Partenaires' },
  { value: 'etudiants', label: 'Étudiants' },
  { value: 'famille', label: 'Famille' },
  { value: 'entreprises', label: 'Entreprises' },
];

export const CONTACT_STATUSES = [
  { value: 'actif', label: 'Actif' },
  { value: 'stop', label: 'STOP' },
  { value: 'erreur', label: 'Erreur' },
  { value: 'bloque', label: 'Bloqué' },
  { value: 'vip', label: 'VIP' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'fidele', label: 'Client fidèle' },
];

export const CAMPAIGN_TYPES = [
  { value: 'evenement', label: 'Événement' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'rappel_rdv', label: 'Rappel rendez-vous' },
  { value: 'menu', label: 'Menu / Plat du jour' },
  { value: 'lancement_produit', label: 'Lancement produit' },
  { value: 'invitation', label: 'Invitation' },
  { value: 'information', label: 'Information client' },
];

export const CAMPAIGN_STATUSES = {
  brouillon: { label: 'Brouillon', color: 'bg-paper-dim text-mist-dark' },
  programme: { label: 'Programmée', color: 'bg-marigold-100 text-marigold-900' },
  envoye: { label: 'Envoyée', color: 'bg-forest-100 text-forest-700' },
  termine: { label: 'Terminée', color: 'bg-paper-dim text-mist-dark' },
  annule: { label: 'Annulée', color: 'bg-clay-100 text-clay-700' },
};

export const INTENT_LABELS = {
  INTERESSE: { label: 'Intéressé', color: 'bg-forest-100 text-forest-700' },
  RESERVATION: { label: 'Réservation', color: 'bg-forest-200 text-forest-900' },
  QUESTION_PRIX: { label: 'Question prix', color: 'bg-marigold-100 text-marigold-900' },
  QUESTION_LIEU: { label: 'Question lieu', color: 'bg-marigold-100 text-marigold-900' },
  QUESTION_HEURE: { label: 'Question heure', color: 'bg-marigold-100 text-marigold-900' },
  STOP: { label: 'STOP', color: 'bg-clay-100 text-clay-700' },
  REFUS: { label: 'Refus', color: 'bg-paper-dim text-mist-dark' },
  AUTRE: { label: 'À traiter', color: 'bg-marigold-200 text-marigold-900' },
};

export const REMINDER_OPTIONS = [
  { value: '', label: 'Pas de rappel' },
  { value: '12', label: '12h avant' },
  { value: '24', label: '24h avant' },
  { value: '48', label: '48h avant' },
];
