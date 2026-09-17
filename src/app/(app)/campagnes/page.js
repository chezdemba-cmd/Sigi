'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CAMPAIGN_STATUSES, CAMPAIGN_TYPES } from '@/lib/constants';
import { usePageHeader } from '@/lib/appShell';

export default function CampagnesPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  usePageHeader({ title: 'Campagnes', subtitle: `${campaigns.filter((c) => ['programme', 'envoye'].includes(c.status)).length} en cours` }, [campaigns]);
  useEffect(() => { fetch('/api/campaigns').then((r) => r.ok ? r.json() : Promise.reject(r)).then((data) => setCampaigns(Array.isArray(data) ? data : [])).catch(() => setError('Impossible de charger les campagnes. Réessayez.')); }, []);
  const visible = useMemo(() => campaigns.filter((campaign) => filter === 'all' || (filter === 'active' && ['programme', 'envoye'].includes(campaign.status)) || (filter === 'scheduled' && campaign.status === 'programme') || (filter === 'draft' && campaign.status === 'brouillon')), [campaigns, filter]);
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="inline-flex rounded-md bg-edge-block p-1">{[['all','Toutes'],['active','En cours'],['scheduled','Programmées'],['draft','Brouillons']].map(([key,label]) => <button key={key} type="button" onClick={() => setFilter(key)} className={`rounded-sm px-4 py-2 text-[13px] font-semibold ${filter === key ? 'bg-white text-ink2 shadow-tab' : 'text-muted'}`}>{label}</button>)}</div><Link href="/campagnes/nouvelle" className="text-sm font-semibold text-brand-dark">Nouvelle campagne →</Link></div>
      {error && <p role="alert" className="rounded-md border border-status-errorBorder bg-status-errorBg p-4 text-sm text-status-errorText">{error}</p>}
      <div className="card overflow-x-auto p-0"><table className="w-full"><thead className="border-b border-edge-row bg-surface-header"><tr><th className="th">Campagne</th><th className="th">Client</th><th className="th">Type</th><th className="th">Envoi</th><th className="th">Audience</th><th className="th">Réponses</th><th className="th">Réservations</th><th className="th">Statut</th></tr></thead><tbody className="divide-y divide-edge-row">
        {visible.map((campaign) => { const status = CAMPAIGN_STATUSES[campaign.status] || CAMPAIGN_STATUSES.brouillon; return <tr key={campaign.id} className="transition hover:bg-surface-header"><td className="td"><Link href={`/campagnes/${campaign.id}`} className="font-semibold text-ink2 hover:text-brand-dark">{campaign.name}</Link></td><td className="td">{campaign.clients?.name}</td><td className="td">{CAMPAIGN_TYPES.find((type) => type.value === campaign.type)?.label || campaign.type}</td><td className="td text-xs">{campaign.event_at ? new Date(campaign.event_at).toLocaleString('fr-FR') : '—'}</td><td className="td">{campaign.stats?.programmed ?? '—'}</td><td className="td">{campaign.stats?.replies ?? 0}</td><td className="td">{campaign.stats?.bookings ?? 0}</td><td className="td"><span className={`badge ${status.color}`}>{status.label}</span></td></tr>; })}
        {!visible.length && <tr><td className="td py-10 text-center text-faint" colSpan={8}>Aucune campagne dans cette catégorie.</td></tr>}
      </tbody></table></div>
    </div>
  );
}
