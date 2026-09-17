'use client';
/** Barre latérale : repliable, fixe sur desktop, tiroir superposé sur mobile. */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SquaresFour, Users, AddressBook, Megaphone, SlidersHorizontal, SidebarSimple, SignOut } from '@phosphor-icons/react/dist/ssr';
import { useAppShell } from '@/lib/appShell';

const LINKS = [
  { href: '/dashboard', label: 'Tableau de bord', Icon: SquaresFour, color: '#18A875' },
  { href: '/clients', label: 'Clients', Icon: Users, color: '#3B82F6' },
  { href: '/contacts', label: 'Contacts', Icon: AddressBook, color: '#7357D9' },
  { href: '/campagnes', label: 'Campagnes', Icon: Megaphone, color: '#F4511E' },
  { href: '/parametres', label: 'Paramètres', Icon: SlidersHorizontal, color: '#64748B' },
];

function Logo({ collapsed }) {
  return (
    <div className={`flex items-center border-b border-white/10 py-4 ${collapsed ? 'justify-center px-3' : 'px-4'}`}>
      {collapsed ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[#FAF7F1]" aria-hidden="true">
          <img src="/sigi-mark.jpg" alt="" className="h-full w-full object-cover" />
        </span>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex h-10 w-[102px] shrink-0 items-center overflow-hidden rounded-sm bg-white px-1.5 py-1">
            <img src="/sigi-logo-official.png" alt="Sigi" className="h-full w-full object-contain" />
          </span>
          <span className="ml-auto text-[10px] font-bold tracking-[.08em] text-[#7E8CAE]">AGENCE</span>
        </div>
      )}
    </div>
  );
}

function NavContent({ pathname, onNavigate, onLogout, collapsed, demoGlobal, onToggleCollapse, showCollapse }) {
  return (
    <>
      <Logo collapsed={collapsed} />
      <nav className="flex-1 space-y-1 p-2.5">
        {LINKS.map(({ href, label, Icon, color }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-sm px-2 py-2 text-sm font-medium transition ${
                active ? 'bg-white/[.12] font-semibold text-white' : 'text-[#9AA7C4] hover:bg-white/[.09]'
              }`}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: color }} aria-hidden="true">
                <Icon size={16} weight="fill" color="#fff" />
              </span>
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 p-2.5">
        {demoGlobal && (
          <div className={`flex items-center gap-2 rounded-sm border border-amber/[.35] bg-amber/[.14] ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}`}>
            <span className="h-[7px] w-[7px] shrink-0 animate-sigiPulse rounded-full bg-amber" aria-hidden="true" />
            {!collapsed && <span className="text-xs font-semibold text-[#FBBF4E]">Mode Démo actif</span>}
          </div>
        )}
        {showCollapse && (
          <button onClick={onToggleCollapse}
            className="flex w-full items-center gap-3 rounded-sm px-[11px] py-2 text-sm font-medium text-[#9AA7C4] hover:bg-white/[.09]"
            aria-label={collapsed ? 'Déplier la barre latérale' : 'Réduire la barre latérale'}>
            <SidebarSimple size={18} weight="bold" aria-hidden="true" />
            {!collapsed && 'Réduire'}
          </button>
        )}
        <button onClick={onLogout}
          className={`flex w-full items-center gap-2.5 rounded-sm border border-white/10 px-2.5 py-2 text-left hover:bg-white/[.05] ${collapsed ? 'justify-center' : ''}`}>
          <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-violet text-xs font-bold text-white" aria-hidden="true">AM</span>
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-white">Aïssatou Mbaye</p>
              <p className="truncate text-[11px] text-[#8E9CBC]">Administratrice</p>
            </span>
          )}
          {!collapsed && <SignOut size={16} weight="bold" className="shrink-0 text-[#8E9CBC]" aria-hidden="true" />}
        </button>
      </div>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { demoGlobal } = useAppShell();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydratation depuis localStorage : indisponible côté serveur, ne peut pas être l'état initial.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsed(localStorage.getItem('sigi_sidebar_collapsed') === '1');
    setReady(true);
  }, []);

  function toggleCollapse() {
    setCollapsed((c) => {
      localStorage.setItem('sigi_sidebar_collapsed', c ? '0' : '1');
      return !c;
    });
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <>
      {/* Barre supérieure mobile */}
      <div className="flex items-center gap-3 border-b border-edge-card bg-ink px-4 py-3 md:hidden">
        <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" aria-expanded={open}
          className="rounded-sm border border-white/20 px-3 py-1.5 text-lg leading-none text-white">☰</button>
        <p className="font-display text-base font-extrabold text-white">Sigi</p>
      </div>

      {/* Tiroir mobile */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button aria-label="Fermer le menu" onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/45" tabIndex={-1} />
          <aside className="absolute left-0 top-0 flex h-full w-[246px] flex-col bg-ink shadow-modal">
            <NavContent pathname={pathname} onNavigate={() => setOpen(false)} onLogout={logout}
              collapsed={false} demoGlobal={demoGlobal} showCollapse={false} />
          </aside>
        </div>
      )}

      {/* Barre latérale desktop */}
      <aside style={ready ? undefined : { transition: 'none' }}
        className={`sticky top-0 hidden h-screen shrink-0 flex-col bg-ink transition-[width] duration-[180ms] md:flex ${collapsed ? 'w-[74px]' : 'w-[246px]'}`}>
        <NavContent pathname={pathname} onLogout={logout} collapsed={collapsed} demoGlobal={demoGlobal}
          onToggleCollapse={toggleCollapse} showCollapse />
      </aside>
    </>
  );
}
