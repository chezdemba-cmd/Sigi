'use client';
import { useEffect, useState } from 'react';
import { Check, X, ShieldCheck, UserCircle, WebhooksLogo, Key, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { usePageHeader } from '@/lib/appShell';

export default function ParametresPage() {
  const [clients, setClients] = useState([]);
  const [connections, setConnections] = useState({ anthropic: false, webhook: false });
  usePageHeader({ title: 'Paramètres', subtitle: 'Configuration globale de l’agence' }, []);
  useEffect(() => {
    fetch('/api/clients').then((response) => response.ok ? response.json() : []).then(setClients);
    fetch('/api/settings/status').then((response) => response.ok ? response.json() : { anthropic: false, webhook: false }).then(setConnections);
  }, []);
  const configured = clients.filter((client) => client.wa_phone_number_id && !client.demo_mode);
  return (
    <div className="mx-auto grid max-w-[1500px] gap-5 xl:grid-cols-[1.15fr_1fr]">
      <div className="space-y-5">
        <section className="card p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-status-warnBg text-amber-icon"><Key size={20} weight="fill" /></span><div><h2 className="font-display text-lg font-bold text-ink2">Mode Démo</h2><p className="text-xs text-muted">Protection contre tout envoi réel non souhaité</p></div><span className="ml-auto badge bg-status-warnBg text-status-warnText">Actif</span></div><p className="mt-5 text-sm leading-6 text-cell">L’application peut fonctionner sans clé IA ni configuration Meta. Les envois, réponses, réservations et statistiques sont alors simulés et clairement identifiés.</p><div className="mt-5 rounded-lg bg-edge-block p-4"><p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Passage en mode réel</p><CheckLine ok={configured.length > 0}>Au moins un client Meta configuré</CheckLine><CheckLine ok={false}>Test de connexion réussi</CheckLine><CheckLine ok={false}>Confirmation explicite de l’administrateur</CheckLine></div></section>
        <section className="card p-6"><h2 className="font-display text-lg font-bold text-ink2">Connexions</h2><Connection Icon={Key} name="Claude API" detail="ANTHROPIC_API_KEY · côté serveur" ok={connections.anthropic} /><Connection Icon={WhatsappLogo} name="WhatsApp Business Cloud" detail={`${configured.length} client(s) connecté(s) en mode réel`} ok={configured.length > 0} /><Connection Icon={WebhooksLogo} name="Webhook Verify Token" detail="Configuration serveur sécurisée" ok={connections.webhook} /><p className="mt-4 flex items-center gap-2 border-t border-edge-row pt-4 text-xs text-muted"><ShieldCheck size={17} className="text-brand" />Les clés restent côté serveur et ne sont jamais renvoyées au navigateur.</p></section>
      </div>
      <div className="space-y-5">
        <section className="card p-6"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet text-sm font-bold text-white">AM</span><div><h2 className="font-display text-lg font-bold text-ink2">Profil administrateur</h2><p className="text-sm font-semibold text-ink2">Aïssatou Mbaye</p><p className="text-xs text-muted">Compte administrateur unique</p></div><UserCircle size={25} className="ml-auto text-faint" /></div><div className="mt-5 space-y-3 border-t border-edge-row pt-4 text-sm"><Row label="Double authentification" value="Activée" good /><Row label="Journal d’audit" value="Disponible" good /><Row label="Session sécurisée" value="Active" good /></div></section>
        <section className="card p-6"><div className="flex items-center gap-2"><ShieldCheck size={21} className="text-brand" /><h2 className="font-display text-lg font-bold text-ink2">RGPD</h2></div><div className="mt-5 space-y-3"><CheckLine ok>Consentement obligatoire et tracé pour chaque contact.</CheckLine><CheckLine ok>Désinscription appliquée avant toute classification.</CheckLine><CheckLine ok>Suppression avec anonymisation de l’historique.</CheckLine><CheckLine ok>Cloisonnement strict des données entre clients.</CheckLine></div></section>
        <section className="card p-6"><div className="flex items-center gap-2"><WebhooksLogo size={21} className="text-violet" /><h2 className="font-display text-lg font-bold text-ink2">Webhooks</h2></div><p className="mt-4 text-xs font-bold uppercase text-muted">URL de réception</p><code className="mt-2 block overflow-x-auto rounded-md border border-edge-field bg-edge-block p-3 text-xs text-cell">/api/webhook/whatsapp</code><p className="mt-3 text-xs text-muted">Les événements Meta sont validés et journalisés côté serveur.</p></section>
      </div>
    </div>
  );
}
function CheckLine({ ok, children }) { return <div className="flex items-start gap-2 text-sm text-cell">{ok ? <Check size={17} weight="bold" className="mt-0.5 shrink-0 text-brand" /> : <X size={17} weight="bold" className="mt-0.5 shrink-0 text-faint" />}<span>{children}</span></div>; }
function Connection({ Icon, name, detail, ok }) { return <div className="mt-4 flex items-center gap-3 border-b border-edge-row pb-4 last:border-0"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-edge-block text-ink"><Icon size={18} /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink2">{name}</p><p className="truncate text-xs text-muted">{detail}</p></div><span className={`badge ${ok ? 'bg-status-successBg text-status-successText' : 'bg-status-warnBg text-status-warnText'}`}>{ok ? 'Connecté' : 'À configurer'}</span></div>; }
function Row({ label, value, good }) { return <div className="flex justify-between gap-3"><span className="text-muted">{label}</span><span className={good ? 'font-semibold text-status-successText' : 'text-ink2'}>{value}</span></div>; }
