import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "read-notifications-v1";
const EVENT = "read-notifications-changed";

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function save(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  window.dispatchEvent(new Event(EVENT));
}

export function useReadNotifications() {
  const [readIds, setReadIds] = useState<Set<string>>(() => load());

  useEffect(() => {
    const sync = () => setReadIds(load());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const markRead = useCallback((id: string) => {
    const next = load();
    next.add(id);
    save(next);
  }, []);

  const markAllRead = useCallback((ids: string[]) => {
    const next = load();
    ids.forEach((id) => next.add(id));
    save(next);
  }, []);

  const isRead = useCallback((id: string) => readIds.has(id), [readIds]);

  return { isRead, markRead, markAllRead, readIds };
}
