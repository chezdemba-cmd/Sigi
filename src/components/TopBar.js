'use client';
/** Barre supérieure : fil d'Ariane, titre de page, sélecteur de client, mode Démo/Réel, notifications, action principale. */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CaretDown, Bell, Plus, UploadSimple, Copy, Lightning } from '@phosphor-icons/react/dist/ssr';
import { useAppShell } from '@/lib/appShell';

const ACTIONS = {
  '/dashboard': { label: 'Créer une campagne', Icon: Plus, tone: 'brand', href: '/campagnes/nouvelle' },
  '/clients': { label: 'Ajouter un client', Icon: Plus, tone: 'ink' },
  '/contacts': { label: 'Importer des contacts', Icon: UploadSimple, tone: 'brand' },
  '/campagnes/nouvelle': { label: 'Enregistrer le brouillon', Icon: Copy, tone: 'ink' },
  '/parametres': { label: 'Tester les connexions', Icon: Lightning, tone: 'ink' },
  '/campagnes': { label: 'Créer une campagne', Icon: Plus, tone: 'brand', href: '/campagnes/nouvelle' },
};
// Le détail de campagne (/campagnes/[id]) est géré à part (id dynamique).

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
}

function ClientSelector() {
  const { clients, activeClientId, activeClient, setActiveClientId } = useAppShell();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDocClick); document.removeEventListener('keydown', onKey); };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? clients.filter((c) => c.name.toLowerCase().includes(q)) : clients;
  }, [clients, query]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="flex w-full min-w-0 items-center gap-2.5 rounded-md border border-edge-field bg-white px-3 py-2 text-left sm:w-auto sm:min-w-[216px]">
        <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-sm bg-surface-header text-[11px] font-bold text-ink" aria-hidden="true">
          {activeClient ? initials(activeClient.name) : '—'}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold text-faint">CLIENT ACTIF</span>
          <span className="block truncate text-[13px] font-semibold text-ink2">{activeClient?.name || 'Tous les clients'}</span>
        </span>
        <CaretDown size={13} weight="bold" className="shrink-0 text-faint" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1.5 w-64 rounded-md border border-edge-card bg-white p-2 shadow-card-hover">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un client…"
            className="input mb-1.5 py-2 text-[13px]" />
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((c) => (
              <button key={c.id} type="button" onClick={() => { setActiveClientId(c.id); setOpen(false); setQuery(''); }}
                className={`flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-[13px] hover:bg-surface-header ${c.id === activeClientId ? 'font-semibold text-brand-dark' : 'text-ink2'}`}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-surface-header text-[10px] font-bold text-ink" aria-hidden="true">{initials(c.name)}</span>
                {c.name}
              </button>
            ))}
            {!filtered.length && <p className="px-2 py-3 text-center text-xs text-faint">Aucun client.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function ModePill() {
  const { activeClient } = useAppShell();
  const isDemo = activeClient ? Boolean(activeClient.demo_mode) : true;
  return (
    <span className={`pill ${isDemo ? 'border border-status-warnBorder bg-status-warnBg text-status-warnText' : 'border border-status-successBorder bg-status-successBg text-status-successText'}`}>
      <span className="h-[7px] w-[7px] rounded-full bg-current" aria-hidden="true" />
      {isDemo ? 'Démo' : 'Réel'}
    </span>
  );
}

function NotificationsBell() {
  const { notificationCount } = useAppShell();
  return (
    <Link href="/dashboard" className="relative flex h-[38px] w-[38px] items-center justify-center rounded-md border border-edge-field bg-white" aria-label={`${notificationCount} notification(s)`}>
      <Bell size={18} weight="fill" className="text-ink2" aria-hidden="true" />
      {notificationCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red px-1 text-[10px] font-bold text-white">
          {notificationCount > 99 ? '99+' : notificationCount}
        </span>
      )}
    </Link>
  );
}

function PrimaryButton({ pathname }) {
  const { primaryAction } = useAppShell();
  const config = pathname.startsWith('/campagnes/') && pathname !== '/campagnes/nouvelle'
    ? { label: 'Dupliquer la campagne', Icon: Copy, tone: 'ink' }
    : ACTIONS[pathname];
  if (!config) return null;
  const cls = config.tone === 'brand' ? 'btn' : 'btn-ink';
  if (config.href) return <Link href={config.href} className={cls}><config.Icon size={16} weight="bold" aria-hidden="true" />{config.label}</Link>;
  if (!primaryAction) return null;
  return (
    <button type="button" onClick={primaryAction.onClick} className={cls}>
      <config.Icon size={16} weight="bold" aria-hidden="true" />{config.label}
    </button>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const { pageHeader } = useAppShell();
  const showBreadcrumb = pathname === '/campagnes/nouvelle' || /^\/campagnes\/[^/]+$/.test(pathname);

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-edge-card bg-white/[.88] px-4 py-[13px] backdrop-blur-sm md:px-6">
      <div className="min-w-0 flex-1">
        {showBreadcrumb && pageHeader.breadcrumb && (
          <p className="mb-0.5 text-[12.5px] text-muted">{pageHeader.breadcrumb}</p>
        )}
        <h1 className="truncate font-display text-xl font-extrabold text-ink2">{pageHeader.title}</h1>
        {pageHeader.subtitle && <p className="text-[12.5px] text-muted">{pageHeader.subtitle}</p>}
      </div>
      <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
        <ClientSelector />
        <ModePill />
        <NotificationsBell />
        <PrimaryButton pathname={pathname} />
      </div>
    </div>
  );
}
