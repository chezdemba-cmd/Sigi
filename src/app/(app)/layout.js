import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DemoBanner from '@/components/DemoBanner';
import { AppShellProvider } from '@/lib/appShell';

/** Layout des pages protégées : navigation + contenu. Auth assurée par src/proxy.js. */
export default function AppLayout({ children }) {
  return (
    <AppShellProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <DemoBanner />
          <main className="min-w-0 flex-1 overflow-x-hidden bg-app p-4 animate-sigiIn md:p-6">{children}</main>
        </div>
      </div>
    </AppShellProvider>
  );
}
