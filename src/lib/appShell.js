'use client';
/**
 * Contexte partagé de l'espace agence : liste des clients, client actif (persisté),
 * état du mode Démo global et compteur de notifications. Un seul point de vérité au
 * lieu de refetchs dispersés dans la sidebar, la barre supérieure et les pages.
 */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AppShellContext = createContext(null);
const ACTIVE_CLIENT_KEY = 'sigi_active_client';

export function AppShellProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [activeClientId, setActiveClientIdState] = useState('');
  const [demoGlobal, setDemoGlobal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [primaryAction, setPrimaryActionState] = useState(null);
  const [pageHeader, setPageHeaderState] = useState({ title: '', subtitle: '', breadcrumb: null });

  // Une page enregistre son action principale ({ label, onClick }) ; la TopBar l'affiche.
  // Le paramètre `deps` (tableau) évite de retomber en boucle infinie de rendu.
  const setPrimaryAction = useCallback((action) => setPrimaryActionState(action), []);

  const refreshClients = useCallback(async () => {
    const res = await fetch('/api/clients');
    if (!res.ok) return;
    const data = await res.json();
    setClients(Array.isArray(data) ? data : []);
  }, []);

  const refreshDemoGlobal = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/demo');
      if (!res.ok) return;
      const data = await res.json();
      setDemoGlobal(Boolean(data.demoGlobal));
    } catch { /* endpoint pas encore disponible */ }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/count');
      if (!res.ok) return;
      const data = await res.json();
      setNotificationCount(Number(data.count) || 0);
    } catch { /* endpoint pas encore disponible */ }
  }, []);

  useEffect(() => {
    // Hydratation depuis localStorage : indisponible côté serveur, ne peut pas être l'état initial.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveClientIdState(localStorage.getItem(ACTIVE_CLIENT_KEY) || '');
    refreshClients();
    refreshDemoGlobal();
    refreshNotifications();
  }, [refreshClients, refreshDemoGlobal, refreshNotifications]);

  useEffect(() => {
    if (!activeClientId && clients.length) setActiveClientId(clients[0].id);
  }, [clients]); // eslint-disable-line react-hooks/exhaustive-deps

  function setActiveClientId(id) {
    setActiveClientIdState(id);
    localStorage.setItem(ACTIVE_CLIENT_KEY, id);
  }

  const activeClient = clients.find((c) => c.id === activeClientId) || null;

  return (
    <AppShellContext.Provider value={{
      clients, activeClientId, activeClient, setActiveClientId,
      demoGlobal, refreshDemoGlobal,
      notificationCount, refreshNotifications,
      refreshClients,
      primaryAction, setPrimaryAction,
      pageHeader, setPageHeader: setPageHeaderState,
    }}>
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useAppShell doit être utilisé sous AppShellProvider');
  return ctx;
}

/** Enregistre l'action du bouton principal de la TopBar le temps que la page est montée. */
export function usePrimaryAction(onClick, deps = []) {
  const { setPrimaryAction } = useAppShell();
  useEffect(() => {
    setPrimaryAction(onClick ? { onClick } : null);
    return () => setPrimaryAction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Enregistre le titre/sous-titre/fil d'Ariane de la page courante pour la TopBar. */
export function usePageHeader({ title, subtitle, breadcrumb }, deps = []) {
  const { setPageHeader } = useAppShell();
  useEffect(() => {
    setPageHeader({ title, subtitle, breadcrumb: breadcrumb || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
