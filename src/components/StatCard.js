/** Carte de statistique simple pour les dashboards. */
export default function StatCard({ label, value, icon, accent = false }) {
  return (
    <div className={`flex items-center gap-4 border-t-2 bg-white/60 px-4 py-3 ${accent ? 'border-forest-600' : 'border-line'}`}>
      <span className="text-xl" aria-hidden="true">{icon}</span>
      <div>
        <p className="font-display text-2xl leading-tight text-ink">{value ?? '—'}</p>
        <p className="text-xs text-mist-dark">{label}</p>
      </div>
    </div>
  );
}
