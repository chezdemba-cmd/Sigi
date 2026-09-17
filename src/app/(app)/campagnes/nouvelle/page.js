'use client';
/**
 * Page 6 — Créer une campagne.
 * Client → infos → visuel → ciblage → génération IA → aperçu WhatsApp → programmation.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WhatsAppPreview from '@/components/WhatsAppPreview';
import Field from '@/components/Field';
import { CAMPAIGN_TYPES, CONTACT_CATEGORIES, REMINDER_OPTIONS } from '@/lib/constants';
import { usePageHeader, usePrimaryAction } from '@/lib/appShell';

const STEPS = ['Informations', 'Audience', 'Message', 'Visuel', 'Programmation', 'Vérification'];

export default function NouvelleCampagnePage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [f, setF] = useState({
    client_id: '', name: '', type: 'evenement', event_at: '', send_at: '',
    reminder_hours: '24', offer: '', location: '', target_categories: [],
    image_url: '', message_main: '', message_reminder: '',
  });
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('main'); // main | reminder
  const [step, setStep] = useState(1);
  usePageHeader({ title: 'Nouvelle campagne', breadcrumb: 'Campagnes' }, []);
  usePrimaryAction(() => save('brouillon'), [f]);

  useEffect(() => {
    fetch('/api/clients').then((r) => r.json()).then((cs) => {
      setClients(cs);
      if (cs.length) setF((f) => ({ ...f, client_id: cs[0].id }));
    });
  }, []);

  const client = clients.find((c) => c.id === f.client_id);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // `datetime-local` donne une heure murale sans fuseau : on la fige en instant UTC
  // (offset explicite) avant l'API, qui exige désormais un offset (audit R14).
  const toInstant = (local) => (local ? new Date(local).toISOString() : null);

  function toggleCategory(cat) {
    setF((f) => ({
      ...f,
      target_categories: f.target_categories.includes(cat)
        ? f.target_categories.filter((x) => x !== cat)
        : [...f.target_categories, cat],
    }));
  }

  async function uploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError('');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) return setError(data.error);
    setF((f) => ({ ...f, image_url: data.url }));
  }

  async function generate() {
    setGenerating(true); setError('');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: f.client_id, campaignName: f.name, type: f.type,
        event_at: toInstant(f.event_at), offer: f.offer, location: f.location,
        reminder_hours: Number(f.reminder_hours) || 24,
      }),
    });
    const data = await res.json();
    setGenerating(false);
    if (!res.ok) return setError(data.error);
    setF((prev) => ({ ...prev, message_main: data.main, message_reminder: data.reminder }));
  }

  async function save(status) {
    setSaving(true); setError('');
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...f,
        reminder_hours: f.reminder_hours ? Number(f.reminder_hours) : null,
        event_at: toInstant(f.event_at),
        send_at: toInstant(f.send_at),
        status,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error);
    router.push(`/campagnes/${data.id}`);
  }

  const previewMessage = (preview === 'main' ? f.message_main : f.message_reminder)
    ?.replaceAll('{{prenom}}', 'Awa');

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div className="card p-3"><div className="mb-3 h-1.5 overflow-hidden rounded-full bg-edge-block"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${step / STEPS.length * 100}%` }} /></div><div className="grid grid-cols-3 gap-2 md:grid-cols-6">{STEPS.map((label, index) => { const number = index + 1; return <button key={label} type="button" onClick={() => setStep(number)} className={`flex items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-semibold ${step === number ? 'bg-status-successBg text-status-successText' : number < step ? 'text-cell' : 'text-faint'}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${step === number ? 'bg-brand text-white' : 'bg-edge-block'}`}>{number < step ? '✓' : number}</span><span className="hidden truncate sm:block">{label}</span></button>; })}</div></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* -------- Formulaire -------- */}
        <div className="space-y-4">
          <div className="card grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2"><h2 className="font-display text-base font-bold text-ink2">Informations de la campagne</h2><p className="mt-1 text-xs text-muted">Ces éléments alimentent la génération du message et la programmation.</p></div>
            <Field label="Client *">
              <select className="input" value={f.client_id} onChange={set('client_id')}>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name} {c.demo_mode ? '(démo)' : ''}</option>)}
              </select></Field>
            <Field label="Nom de la campagne *">
              <input className="input" value={f.name} onChange={set('name')} placeholder="Match Côte d'Ivoire vs Sénégal" /></Field>
            <Field label="Type">
              <select className="input" value={f.type} onChange={set('type')}>
                {CAMPAIGN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select></Field>
            <Field label="Date/heure de l'événement">
              <input className="input" type="datetime-local" value={f.event_at} onChange={set('event_at')} /></Field>
            <Field label="Date/heure d'envoi initial">
              <input className="input" type="datetime-local" value={f.send_at} onChange={set('send_at')} /></Field>
            <Field label="Rappel automatique">
              <select className="input" value={f.reminder_hours} onChange={set('reminder_hours')}>
                {REMINDER_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select></Field>
            <Field label="Offre spéciale / info">
              <input className="input" value={f.offer} onChange={set('offer')} placeholder="Garba Thon 10 €" /></Field>
            <Field label="Lieu">
              <input className="input" value={f.location} onChange={set('location')} placeholder="Chez Demba, Angers" /></Field>
            <Field className="md:col-span-2" label="Visuel / affiche (jpg, png, webp — max 5 Mo)">
              <input type="file" accept="image/*" onChange={uploadImage} className="text-sm" />
              {uploading && <p className="text-xs text-mist-dark">Envoi en cours…</p>}
              {f.image_url && <p className="mt-1 text-xs text-forest-700">✓ Visuel ajouté</p>}
            </Field>
          </div>

          <div className="card">
            <h2 className="mb-3 font-display text-base font-bold text-ink2">Audience</h2>
            <p className="label">Catégories de contacts ciblées (aucune = tous les contacts consentants)</p>
            <div className="flex flex-wrap gap-2">
              {CONTACT_CATEGORIES.map((c) => (
                <button key={c.value} type="button" onClick={() => toggleCategory(c.value)}
                  className={`badge border transition ${f.target_categories.includes(c.value)
                    ? 'border-forest-600 bg-forest-100 text-forest-900' : 'border-line bg-white text-mist-dark hover:border-mist'}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-ink">Messages</h2>
              <button type="button" className="btn" onClick={generate} disabled={generating || !f.client_id || !f.name}>
                {generating ? 'Génération…' : '✨ Générer avec l’IA'}
              </button>
            </div>
            <Field label="Message principal">
              <textarea className="input" rows={5} value={f.message_main} onChange={set('message_main')}
                onFocus={() => setPreview('main')} placeholder="Cliquez sur « Générer avec l'IA » ou rédigez vous-même…" /></Field>
            <Field label="Message de rappel">
              <textarea className="input" rows={4} value={f.message_reminder} onChange={set('message_reminder')}
                onFocus={() => setPreview('reminder')} /></Field>
            <p className="text-xs text-mist-dark">
              La variable {'{{prenom}}'} est remplacée par le prénom de chaque contact. La mention STOP est obligatoire.
            </p>
          </div>

          {error && <p className="text-sm text-clay-700">{error}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn-outline" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>Précédent</button>
            <button type="button" className="btn-outline" onClick={() => setStep((current) => Math.min(STEPS.length, current + 1))} disabled={step === STEPS.length}>Étape suivante</button>
            <span className="flex-1" />
            <button className="btn-outline" onClick={() => save('brouillon')} disabled={saving || !f.name}>Enregistrer en brouillon</button>
            <button className="btn" onClick={() => save('programme')} disabled={saving || !f.name || !f.message_main}>
              🗓️ Programmer la campagne
            </button>
          </div>
          {f.event_at && f.reminder_hours && (
            <p className="text-xs text-mist-dark">
              Rappel automatique prévu le {new Date(new Date(f.event_at).getTime() - Number(f.reminder_hours) * 3600000).toLocaleString('fr-FR')}.
            </p>
          )}
        </div>

        {/* -------- Aperçu WhatsApp -------- */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <button className={`badge ${preview === 'main' ? 'bg-ink text-paper' : 'bg-paper-dim text-mist-dark'}`} onClick={() => setPreview('main')}>Message principal</button>
            <button className={`badge ${preview === 'reminder' ? 'bg-ink text-paper' : 'bg-paper-dim text-mist-dark'}`} onClick={() => setPreview('reminder')}>Rappel</button>
          </div>
          <WhatsAppPreview
            message={previewMessage}
            imageUrl={preview === 'main' ? f.image_url : null}
            senderName={client?.name || 'Votre entreprise'}
          />
          {client?.demo_mode && (
            <p className="border-t-2 border-marigold-500 bg-marigold-50 p-3 text-xs text-marigold-900">
              Ce client est en <b>mode démo</b> : les envois seront simulés, aucun vrai message WhatsApp ne partira.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
