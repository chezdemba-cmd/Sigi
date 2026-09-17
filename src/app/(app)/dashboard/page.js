'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Buildings, Megaphone, PaperPlaneTilt, ChatCircleDots, CalendarCheck,
  TrendUp, ArrowRight, WarningCircle,
} from '@phosphor-icons/react/dist/ssr';
import { usePageHeader } from '@/lib/appShell';
import { INTENT_LABELS } from '@/lib/constants';

const METRICS = [
  { key: 'activeClients', label: 'Clients actifs', Icon: Buildings, tone: 'blue', note: 'portefeuille agence' },
  { key: 'activeCampaigns', label: 'Campagnes actives', Icon: Megaphone, tone: 'violet', note: 'en cours ou envoyées' },
  { key: 'messagesSent', label: 'Messages envoyés', Icon: PaperPlaneTilt, tone: 'green', note: 'volume cumulé' },
  { key: 'repliesReceived', label: 'Réponses reçues', Icon: ChatCircleDots, tone: 'orange', note: 'à qualifier' },
  { key: 'reservations', label: 'Réservations', Icon: CalendarCheck, tone: 'green', note: 'créées depuis WhatsApp' },
];

const TONES = {
  blue: 'bg-status-blueBg text-status-blueText',
  violet: 'bg-status-violetBg text-status-violetText',
  green: 'bg-status-successBg text-status-successText',
  orange: 'bg-status-orangeBg text-status-orangeText',
};

function compact(value) {
  return new Intl.NumberFormat('fr-FR', { notation: value > 9999 ? 'compact' : 'standard' }).format(value || 0);
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  usePageHeader({ title: 'Tableau de bord', subtitle: 'Vue globale de l’agence' }, []);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setStats)
      .catch(() => setError('Impossible de charger les statistiques. Réessayez dans un instant.'));
  }, []);

  const chart = useMemo(() => {
    const rows = stats?.weeklyActivity || [];
    const max = Math.max(1, ...rows.map((row) => Number(row.sent) || 0));
    return rows.map((row) => ({ ...row, height: Math.max(8, Math.round((Number(row.sent) || 0) / max * 100)) }));
  }, [stats]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-md border border-status-errorBorder bg-status-errorBg px-4 py-3 text-sm text-status-errorText">
          <WarningCircle size={18} weight="fill" />{error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Indicateurs principaux">
        {METRICS.map(({ key, label, Icon, tone, note }) => (
          <article key={key} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12.5px] font-medium text-muted">{label}</p>
                <p className="mt-2 font-display text-[27px] font-extrabold leading-none text-ink2">{stats ? compact(stats[key]) : '—'}</p>
              </div>
              <span className={`flex h-9 w-9 items-center justify-center rounded-md ${TONES[tone]}`}><Icon size={18} weight="fill" /></span>
            </div>
            <p className="mt-3 text-[11.5px] text-faint">{note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="card min-h-[310px]">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="font-display text-base font-bold text-ink2">Activité des campagnes</h2><p className="mt-1 text-xs text-muted">Messages envoyés par semaine</p></div>
            <span className="badge bg-status-successBg text-status-successText"><TrendUp size={13} weight="bold" /> Activité</span>
          </div>
          <div className="mt-7 flex h-[190px] items-end gap-3 border-b border-edge-row px-1">
            {chart.length ? chart.map((row, index) => (
              <div key={row.weekStart || index} className="group flex h-full min-w-0 flex-1 items-end justify-center">
                <div className="relative w-full max-w-12 rounded-t-md bg-ink transition-colors hover:bg-brand" style={{ height: `${row.height}%` }}>
                  <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-ink px-2 py-1 text-[10px] text-white group-hover:block">{compact(row.sent)}</span>
                </div>
              </div>
            )) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-faint">L’activité apparaîtra après les premiers envois.</div>
            )}
          </div>
          {!!chart.length && <div className="mt-2 flex justify-between text-[10px] text-faint"><span>{new Date(chart[0].weekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span><span>Aujourd’hui</span></div>}
        </article>

        <article className="card">
          <div className="flex items-center justify-between"><h2 className="font-display text-base font-bold text-ink2">À traiter</h2><span className="badge bg-status-violetBg text-status-violetText">{stats?.toHandle?.length || 0} réponses</span></div>
          <div className="mt-4 divide-y divide-edge-row">
            {stats?.toHandle?.slice(0, 5).map((message) => {
              const intent = INTENT_LABELS[message.intent] || INTENT_LABELS.AUTRE;
              const contact = message.contacts || {};
              return (
                <div key={message.id} className="py-3 first:pt-0">
                  <div className="flex items-center gap-2"><span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink2">{contact.first_name || contact.phone || 'Contact'}</span><span className="badge bg-status-neutralBg text-status-neutralText">{intent.label}</span></div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">{message.body}</p>
                </div>
              );
            })}
            {stats && !stats.toHandle?.length && <p className="py-10 text-center text-sm text-faint">Aucune réponse en attente.</p>}
            {!stats && <p className="py-10 text-center text-sm text-faint">Chargement…</p>}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/campagnes/nouvelle" className="card card-hover group flex items-center gap-4 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-status-successBg text-status-successText"><Megaphone size={19} weight="fill" /></span><span className="flex-1"><span className="block text-sm font-semibold text-ink2">Créer une campagne</span><span className="text-xs text-muted">Préparer un nouvel envoi WhatsApp</span></span><ArrowRight className="text-faint transition group-hover:translate-x-1" /></Link>
        <Link href="/contacts" className="card card-hover group flex items-center gap-4 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-status-violetBg text-status-violetText"><ChatCircleDots size={19} weight="fill" /></span><span className="flex-1"><span className="block text-sm font-semibold text-ink2">Gérer les contacts</span><span className="text-xs text-muted">Importer, filtrer et vérifier</span></span><ArrowRight className="text-faint transition group-hover:translate-x-1" /></Link>
        <Link href="/clients" className="card card-hover group flex items-center gap-4 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-md bg-status-blueBg text-status-blueText"><Buildings size={19} weight="fill" /></span><span className="flex-1"><span className="block text-sm font-semibold text-ink2">Voir les clients</span><span className="text-xs text-muted">Configurer les espaces clients</span></span><ArrowRight className="text-faint transition group-hover:translate-x-1" /></Link>
      </section>
    </div>
  );
}
