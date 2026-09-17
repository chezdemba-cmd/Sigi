'use client';
/**
 * Page 1 — Connexion admin agence.
 * Écart volontaire avec le handoff : pas de champ e-mail ni de "mot de passe oublié" —
 * l'application n'a qu'un seul compte admin (mot de passe partagé, cf. src/lib/auth.js),
 * un champ ou un lien qui ne correspond à aucun vrai mécanisme serait trompeur.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeSlash, Warning, ShieldCheck, Sparkle, Shield, Users } from '@phosphor-icons/react/dist/ssr';
import Field from '@/components/Field';

const HIGHLIGHTS = [
  { Icon: Sparkle, title: 'Messages générés puis validés par vous', text: 'Trois variantes proposées, toujours modifiables avant envoi.' },
  { Icon: Shield, title: 'Consentement tracé, STOP respecté', text: 'Toute désinscription bloque immédiatement les envois et rappels.' },
  { Icon: Users, title: 'Un client, un cloisonnement strict', text: 'Contacts, identifiants et statistiques ne se croisent jamais.' },
];

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) router.push('/dashboard');
    else setError('Mot de passe incorrect.');
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-white px-6 py-12 md:px-[8vw]">
        <form onSubmit={submit} className="w-full max-w-[420px] animate-sigiIn">
          <div className="mb-11">
            <img src="/sigi-logo-official.png" alt="Sigi" className="h-[72px] w-auto object-contain" />
          </div>
          <h1 className="max-w-[15em] font-display text-[31px] font-extrabold leading-[1.2] tracking-[-.03em] text-ink2">
            Vos campagnes WhatsApp, simplement maîtrisées.
          </h1>
          <p className="mt-3 text-[14.5px] text-muted">
            Espace réservé à l&apos;équipe de l&apos;agence. Un seul compte administrateur pilote les campagnes de tous les clients.
          </p>

          <div className="mt-9 space-y-4">
            <Field label="Mot de passe administrateur">
              <div className="relative">
                <input
                  type={reveal ? 'text' : 'password'} className={`input pr-11 ${error ? 'input-error' : ''}`} value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                />
                <button type="button" onClick={() => setReveal((r) => !r)} tabIndex={-1}
                  aria-label={reveal ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm text-muted hover:bg-surface-header">
                  {reveal ? <EyeSlash size={17} weight="bold" /> : <Eye size={17} weight="bold" />}
                </button>
              </div>
            </Field>
            {error && (
              <p className="flex items-center gap-1.5 text-[12.5px] text-red" role="alert" aria-live="polite">
                <Warning size={14} weight="fill" className="shrink-0" /> {error}
              </p>
            )}
            <button className="btn w-full justify-center" disabled={loading || !password}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
            <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
              <ShieldCheck size={15} weight="fill" className="shrink-0 text-brand" />
              Connexion chiffrée. Accès journalisé conformément au RGPD.
            </p>
          </div>
        </form>
      </div>

      <div className="relative hidden overflow-hidden bg-ink px-6 py-12 md:flex md:flex-col md:justify-center md:px-[6vw]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-50" aria-hidden="true">
          <defs>
            <pattern id="sigi-stripes" width="10" height="10" patternTransform="rotate(35)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#FFFFFF" strokeOpacity=".07" strokeWidth="5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sigi-stripes)" />
        </svg>
        <div className="relative space-y-6">
          <p className="text-[11px] font-bold tracking-[.12em] text-brand">MODE DÉMO DISPONIBLE</p>
          <h2 className="font-display text-[23px] font-bold text-white">Testez un envoi complet sans brancher un seul compte Meta.</h2>
          <div className="space-y-3">
            {HIGHLIGHTS.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/[.07] p-4">
                <div className="mb-1.5 flex items-center gap-2.5">
                  <Icon size={19} weight="fill" className="shrink-0 text-brand" aria-hidden="true" />
                  <p className="text-[13.5px] font-semibold text-white">{title}</p>
                </div>
                <p className="text-[12.5px] text-[#9AA7C4]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
