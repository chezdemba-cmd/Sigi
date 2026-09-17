'use client';
/** Bandeau permanent tant que le mode Démo global est actif. */
import Link from 'next/link';
import { Warning } from '@phosphor-icons/react/dist/ssr';
import { useAppShell } from '@/lib/appShell';

export default function DemoBanner() {
  const { demoGlobal } = useAppShell();
  if (!demoGlobal) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-status-warnBorder bg-status-warnBg px-4 py-2.5 text-[13px] text-status-warnText md:px-6">
      <Warning size={16} weight="fill" className="shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <strong className="font-semibold">Mode Démo</strong> — aucun message réel ne sera envoyé. Les données affichées sont simulées.
      </span>
      <Link href="/parametres" className="shrink-0 font-semibold underline">Configurer le mode Réel</Link>
    </div>
  );
}
