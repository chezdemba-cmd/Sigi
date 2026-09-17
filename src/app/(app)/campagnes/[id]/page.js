'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Prohibit, CalendarCheck, ChatCircleDots, PaperPlaneTilt } from '@phosphor-icons/react/dist/ssr';
import WhatsAppPreview from '@/components/WhatsAppPreview';
import { CAMPAIGN_STATUSES, INTENT_LABELS } from '@/lib/constants';
import { usePageHeader } from '@/lib/appShell';

const TABS = [['overview', 'Vue d’ensemble'], ['sends', 'Envois'], ['replies', 'Réponses'], ['bookings', 'Réservations'], ['stats', 'Statistiques']];

export default function DetailCampagnePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('replies');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [drafts, setDrafts] = useState({});
  const campaign = data?.campaign;
  usePageHeader({ title: campaign?.name || 'Campagne', breadcrumb: 'Campagnes' }, [campaign?.name]);

  const load = useCallback(() => fetch(`/api/campaigns/${id}`).then((response) => response.ok ? response.json() : Promise.reject(response)).then(setData).catch(() => setNotice('Impossible de charger cette campagne.')), [id]);
  useEffect(() => { load(); }, [load]);

  async function post(url, label) {
    setBusy(label); setNotice('');
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const result = await response.json(); setBusy(''); setNotice(response.ok ? `✓ ${label}` : `Erreur : ${result.error}`); load();
  }
  async function patch(url, body) {
    setBusy('update'); const response = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const result = await response.json(); setBusy(''); if (!response.ok) setNotice(`Erreur : ${result.error}`); load();
  }
  async function sendReply(message) {
    const text = (drafts[message.id] ?? message.suggestion ?? '').trim(); if (!text) return;
    setBusy(`reply-${message.id}`); const response = await fetch(`/api/messages/${message.id}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
    const result = await response.json(); setBusy(''); setNotice(response.ok ? (result.simulated ? '✓ Réponse simulée' : '✓ Réponse envoyée') : `Erreur : ${result.error}`); load();
  }

  const values = useMemo(() => {
    const stats = data?.stats || {};
    const sent = stats.sent || 0;
    return [
      ['Destinataires', stats.programmed || sent, 100, '#14213D'], ['Envoyés', sent, 100, '#21365D'],
      ['Livrés', stats.delivered ?? sent, sent ? Math.round((stats.delivered ?? sent) / sent * 100) : 0, '#344D80'],
      ['Lus', stats.read || 0, sent ? Math.round((stats.read || 0) / sent * 100) : 0, '#18A875'],
      ['Réponses', stats.replies || 0, sent ? Math.round((stats.replies || 0) / sent * 100) : 0, '#7357D9'],
      ['Réservations', stats.bookings || 0, sent ? Math.round((stats.bookings || 0) / sent * 100) : 0, '#5B3FC4'],
    ];
  }, [data]);

  if (!campaign) return <p className="p-6 text-sm text-muted">Chargement…</p>;
  const { messages = [], reservations = [], stats = {} } = data;
  const replies = messages.filter((message) => message.direction === 'in');
  const outbound = messages.filter((message) => message.direction === 'out');
  const isDemo = Boolean(campaign.clients?.demo_mode);
  const status = CAMPAIGN_STATUSES[campaign.status] || CAMPAIGN_STATUSES.brouillon;

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      {notice && <p className="rounded-md border border-edge-card bg-white px-4 py-3 text-sm text-muted">{notice}</p>}
      <section className="card p-5">
        <div className="flex flex-wrap items-start gap-3"><span className="flex h-[50px] w-[50px] items-center justify-center rounded-lg bg-status-orangeBg text-sm font-bold text-status-orangeText">{campaign.clients?.name?.slice(0, 2).toUpperCase() || 'SI'}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-lg font-bold text-ink2">{campaign.name}</h2><span className={`badge ${status.color}`}>{status.label}</span>{isDemo && <span className="badge bg-status-warnBg text-status-warnText">Mode Démo</span>}</div><p className="mt-1 text-[13px] text-muted">{campaign.clients?.name} · {campaign.type} {campaign.event_at ? `· ${new Date(campaign.event_at).toLocaleString('fr-FR')}` : ''}</p></div><div className="flex gap-2">{!campaign.main_sent_at && <button className="btn" disabled={!!busy} onClick={() => post(`/api/campaigns/${id}/send`, isDemo ? 'Simulation programmée' : 'Envoi lancé')}>{isDemo ? 'Simuler l’envoi' : 'Envoyer maintenant'}</button>}{isDemo && campaign.main_sent_at && <button className="btn-outline" disabled={!!busy} onClick={() => post(`/api/campaigns/${id}/simulate-replies`, 'Réponses simulées')}>Simuler des réponses</button>}</div></div>
        <div className="mt-6 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">{values.map(([label, value, percent, color]) => <div key={label} className="flex min-w-0 flex-col justify-end"><div className="flex h-28 items-end"><div className="w-full rounded-t-md" style={{ height: `${Math.max(12, Number(percent))}%`, background: color }} /></div><strong className="mt-3 font-display text-xl text-ink2">{Number(value).toLocaleString('fr-FR')}</strong><span className="text-xs text-muted">{label}</span><span className="mt-0.5 text-[11px] text-faint">{percent} %</span></div>)}</div>
      </section>

      <div className="flex overflow-x-auto rounded-md bg-edge-block p-1">{TABS.map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={`whitespace-nowrap rounded-sm px-5 py-2 text-[13px] font-semibold ${tab === key ? 'bg-white text-ink2 shadow-tab' : 'text-muted'}`}>{label}</button>)}</div>

      {tab === 'replies' && <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]"><section className="card p-0"><div className="flex items-center justify-between border-b border-edge-row px-5 py-4"><h3 className="font-display text-base font-bold text-ink2">Réponses reçues</h3><span className="badge bg-status-warnBg text-status-warnText">{replies.filter((message) => !message.handled).length} à traiter</span></div><div className="divide-y divide-edge-row">{replies.map((message) => { const intent = INTENT_LABELS[message.intent] || INTENT_LABELS.AUTRE; return <article key={message.id} className={`p-5 ${message.intent === 'STOP' ? 'bg-red/[.025]' : ''}`}><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-violetBg text-xs font-bold text-status-violetText">{message.contacts?.first_name?.slice(0, 2).toUpperCase() || 'WA'}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-ink2">{message.contacts?.first_name || message.contacts?.phone}</strong><span className={`badge ${intent.color}`}>{intent.label}</span></div><p className="mt-2 text-[13px] text-cell">« {message.body} »</p>{!message.handled && <div className="mt-3"><textarea className="input text-xs" rows={2} value={drafts[message.id] ?? message.suggestion ?? ''} onChange={(event) => setDrafts((current) => ({ ...current, [message.id]: event.target.value }))} placeholder="Votre réponse…" /><div className="mt-2 flex gap-2"><button className="btn px-3 py-2 text-xs" disabled={!!busy} onClick={() => sendReply(message)}>Répondre</button><button className="btn-outline px-3 py-2 text-xs" disabled={!!busy} onClick={() => patch(`/api/messages/${message.id}`, { handled: true })}>Marquer comme traitée</button></div></div>}</div></div></article>; })}{!replies.length && <p className="p-10 text-center text-sm text-faint">Aucune réponse reçue.</p>}</div></section><aside className="space-y-5">{stats.stops > 0 && <div className="rounded-lg border border-status-errorBorder bg-white p-5"><div className="flex gap-3"><Prohibit size={21} className="text-red" /><div><h3 className="font-semibold text-ink2">{stats.stops} désinscription{stats.stops > 1 ? 's' : ''} STOP</h3><p className="mt-1 text-xs text-muted">Traitées avant toute classification. Ces contacts sont exclus des prochains envois.</p></div></div></div>}<Reservations reservations={reservations} busy={busy} patch={patch} /></aside></div>}

      {tab === 'bookings' && <Reservations reservations={reservations} busy={busy} patch={patch} wide />}
      {tab === 'sends' && <section className="card p-0"><div className="border-b border-edge-row px-5 py-4"><h3 className="font-display font-bold text-ink2">Journal des envois ({outbound.length})</h3></div><div className="divide-y divide-edge-row">{outbound.map((message) => <div key={message.id} className="flex items-center gap-3 px-5 py-3 text-sm"><PaperPlaneTilt className="text-brand" /><span className="flex-1 text-ink2">{message.contacts?.first_name || message.contacts?.phone}</span><span className="text-xs text-muted">{message.kind === 'reminder' ? 'Rappel' : 'Principal'}</span><span className="badge bg-status-neutralBg text-status-neutralText">{message.status}</span></div>)}</div></section>}
      {tab === 'overview' && <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><section className="card"><h3 className="font-display font-bold text-ink2">Vue d’ensemble</h3><p className="mt-2 text-sm text-muted">Le message conserve son historique, son audience et les exclusions RGPD appliquées au moment de l’envoi.</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><Info label="Message principal" value={`${campaign.message_main?.length || 0} caractères`} /><Info label="Rappel" value={campaign.reminder_at ? new Date(campaign.reminder_at).toLocaleString('fr-FR') : 'Désactivé'} /><Info label="Incidents" value={String(stats.failed || 0)} /></div></section><WhatsAppPreview message={campaign.message_main?.replaceAll('{{prenom}}', 'Awa')} imageUrl={campaign.image_url} senderName={campaign.clients?.name} /></div>}
      {tab === 'stats' && <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Info label="Taux de réponse" value={`${stats.sent ? Math.round((stats.replies || 0) / stats.sent * 100) : 0} %`} /><Info label="Taux de réservation" value={`${stats.sent ? Math.round((stats.bookings || 0) / stats.sent * 100) : 0} %`} /><Info label="Échecs" value={String(stats.failed || 0)} /><Info label="STOP" value={String(stats.stops || 0)} /></section>}
    </div>
  );
}

function Info({ label, value }) { return <div className="card"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-2 font-display text-xl font-bold text-ink2">{value}</p></div>; }
function Reservations({ reservations, busy, patch, wide = false }) { return <section className={`card ${wide ? 'max-w-4xl' : ''}`}><div className="flex items-center gap-2"><CalendarCheck size={19} className="text-brand" /><h3 className="font-display font-bold text-ink2">Réservations générées</h3></div><div className="mt-4 divide-y divide-edge-row">{reservations.map((reservation) => <div key={reservation.id} className="flex items-center gap-3 py-3"><ChatCircleDots className="text-violet" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink2">{reservation.contacts?.first_name || reservation.contacts?.phone}</p><p className="truncate text-xs text-muted">{reservation.details}</p></div><span className="badge bg-status-warnBg text-status-warnText">{reservation.status}</span>{reservation.status !== 'confirmee' && <button className="text-xs font-semibold text-brand-dark" disabled={!!busy} onClick={() => patch(`/api/reservations/${reservation.id}`, { status: 'confirmee' })}>Confirmer</button>}</div>)}{!reservations.length && <p className="py-8 text-center text-sm text-faint">Aucune réservation.</p>}</div></section>; }
