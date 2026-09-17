'use client';

import { useEffect, useMemo, useState } from 'react';
import { DotsThree, MagnifyingGlass, Plus, PencilSimple, Trash, WhatsappLogo, X } from '@phosphor-icons/react/dist/ssr';
import Field from '@/components/Field';
import { SECTORS, TONES } from '@/lib/constants';
import { usePageHeader, usePrimaryAction } from '@/lib/appShell';

const EMPTY = {
  name: '', sector: 'restaurant', city: '', whatsapp_phone: '', email: '',
  status: 'test', tone: 'chaleureux', demo_mode: true,
  wa_phone_number_id: '', wa_business_account_id: '', wa_access_token: '',
};

const COLORS = [
  'bg-status-orangeBg text-status-orangeText',
  'bg-status-violetBg text-status-violetText',
  'bg-status-blueBg text-status-blueText',
  'bg-status-successBg text-status-successText',
];

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';
}

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(null);
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [listError, setListError] = useState('');

  usePageHeader({ title: 'Clients', subtitle: `${clients.filter((c) => c.status !== 'archive').length} clients actifs` }, [clients]);
  usePrimaryAction(() => setForm({ ...EMPTY }), []);

  const load = () => fetch('/api/clients')
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((data) => { setClients(Array.isArray(data) ? data : []); setListError(''); })
    .catch(() => setListError('Impossible de charger les clients. Réessayez.'));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => clients.filter((client) => {
    const text = `${client.name} ${client.city || ''}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!sector || client.sector === sector) && (!status || client.status === status);
  }), [clients, query, sector, status]);

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });

  async function save(event) {
    event.preventDefault(); setError('');
    const editing = Boolean(form.id);
    const response = await fetch(editing ? `/api/clients/${form.id}` : '/api/clients', {
      method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || 'Enregistrement impossible.');
    setForm(null); load();
  }

  async function remove(id) {
    if (!confirm('Supprimer ce client et toutes ses données ?')) return;
    await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[260px] flex-1 md:max-w-[475px]">
          <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
          <input className="input pl-11" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un client…" />
        </label>
        <select className="input w-auto min-w-[190px]" value={sector} onChange={(e) => setSector(e.target.value)}><option value="">Tous les secteurs</option>{SECTORS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
        <select className="input w-auto min-w-[130px]" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tous</option><option value="actif">Actifs</option><option value="pause">En pause</option><option value="test">Test</option></select>
        <span className="ml-auto text-xs text-muted">{filtered.length} client{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {listError && <p role="alert" className="rounded-md border border-status-errorBorder bg-status-errorBg p-4 text-sm text-status-errorText">{listError}</p>}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((client, index) => (
          <article key={client.id} className="card card-hover flex min-h-[300px] flex-col p-5">
            <div className="flex items-start gap-3">
              <span className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg text-sm font-bold ${COLORS[index % COLORS.length]}`}>{initials(client.name)}</span>
              <div className="min-w-0 flex-1"><h2 className="truncate font-display text-[17px] font-bold text-ink2">{client.name}</h2><p className="mt-1 text-[13px] text-muted">{SECTORS.find((item) => item.value === client.sector)?.label || client.sector} · ton {TONES.find((item) => item.value === client.tone)?.label?.toLowerCase() || client.tone}</p></div>
              <button type="button" className="rounded-sm p-1 text-faint hover:bg-surface-header" aria-label={`Options pour ${client.name}`}><DotsThree size={20} weight="bold" /></button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`badge ${client.wa_phone_number_id ? 'bg-status-successBg text-status-successText' : 'bg-status-errorBg text-status-errorText'}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{client.wa_phone_number_id ? 'WhatsApp connecté' : 'Non configuré'}</span>
              <span className={`badge ${client.demo_mode ? 'bg-status-warnBg text-status-warnText' : 'bg-status-successBg text-status-successText'}`}>{client.demo_mode ? 'Mode Démo' : 'Mode Réel'}</span>
              <span className="badge bg-status-neutralBg text-status-neutralText">{client.status || 'Actif'}</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-y border-edge-row py-4">
              <div><p className="font-display text-xl font-extrabold text-ink2">{client.contactsCount ?? 0}</p><p className="text-xs text-muted">contacts</p></div>
              <div><p className="font-display text-xl font-extrabold text-ink2">{client.campaignsCount ?? 0}</p><p className="text-xs text-muted">campagnes</p></div>
              <div><p className="font-display text-xl font-extrabold text-ink2">{client.reservationsCount ?? 0}</p><p className="text-xs text-muted">réservations</p></div>
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <button type="button" className="btn-ink px-3 py-2" onClick={() => setForm({ ...client })}>Ouvrir</button>
              <button type="button" className="btn-outline px-3 py-2" onClick={() => setForm({ ...client })}><PencilSimple size={15} /> Modifier</button>
              <button type="button" className="btn-outline ml-auto px-3 py-2 text-red" onClick={() => remove(client.id)} aria-label={`Supprimer ${client.name}`}><Trash size={15} /></button>
            </div>
          </article>
        ))}

        <button type="button" onClick={() => setForm({ ...EMPTY })} className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-edge-hover p-8 text-center transition hover:border-brand hover:bg-white">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-successBg text-brand"><Plus size={22} weight="bold" /></span>
          <span className="mt-3 text-sm font-semibold text-ink2">Ajouter un client</span>
          <span className="mt-2 max-w-[260px] text-xs text-muted">Nom, secteur, ton de communication et identifiants WhatsApp propres au client.</span>
        </button>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-labelledby="client-form-title">
          <form onSubmit={save} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-modal animate-sigiInModal">
            <div className="mb-5 flex items-center justify-between"><div><h2 id="client-form-title" className="font-display text-xl font-bold text-ink2">{form.id ? 'Modifier le client' : 'Ajouter un client'}</h2><p className="mt-1 text-xs text-muted">Les données et identifiants restent strictement cloisonnés.</p></div><button type="button" onClick={() => setForm(null)} className="rounded-md p-2 text-muted hover:bg-surface-header" aria-label="Fermer"><X size={20} /></button></div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Nom de l’entreprise *"><input className="input" value={form.name} onChange={set('name')} required /></Field>
              <Field label="Secteur"><select className="input" value={form.sector} onChange={set('sector')}>{SECTORS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
              <Field label="Ville"><input className="input" value={form.city || ''} onChange={set('city')} /></Field>
              <Field label="Téléphone WhatsApp"><input className="input" value={form.whatsapp_phone || ''} onChange={set('whatsapp_phone')} placeholder="+221…" /></Field>
              <Field label="E-mail"><input className="input" type="email" value={form.email || ''} onChange={set('email')} /></Field>
              <Field label="Ton des messages"><select className="input" value={form.tone} onChange={set('tone')}>{TONES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
              <Field label="Statut"><select className="input" value={form.status} onChange={set('status')}><option value="actif">Actif</option><option value="pause">Pause</option><option value="test">Test</option></select></Field>
            </div>
            <div className="mt-5 rounded-lg border border-edge-card bg-surface-header p-4">
              <div className="mb-3 flex items-center gap-2"><WhatsappLogo size={19} weight="fill" className="text-brand" /><h3 className="text-sm font-semibold text-ink2">WhatsApp Business Cloud</h3></div>
              <div className="grid gap-4 md:grid-cols-3"><Field label="Phone Number ID"><input className="input" value={form.wa_phone_number_id || ''} onChange={set('wa_phone_number_id')} /></Field><Field label="Business Account ID"><input className="input" value={form.wa_business_account_id || ''} onChange={set('wa_business_account_id')} /></Field><Field label="Access Token"><input className="input" type="password" value={form.wa_access_token || ''} onChange={set('wa_access_token')} /></Field></div>
              <label className="mt-3 flex items-center gap-2 text-sm text-ink2"><input type="checkbox" className="accent-brand" checked={form.demo_mode} onChange={set('demo_mode')} /> Mode Démo — aucun message réel</label>
            </div>
            {error && <p className="mt-4 text-sm text-red" role="alert">{error}</p>}
            <div className="mt-6 flex justify-end gap-2"><button type="button" className="btn-outline" onClick={() => setForm(null)}>Annuler</button><button className="btn">Enregistrer</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
