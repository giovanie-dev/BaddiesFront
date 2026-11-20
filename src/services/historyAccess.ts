// Relie le service IndexedDB au formulaire React, sans dépendance à React ici.
export type HistoryAccessRequest = { mode: "create" | "unlock" | "recovery" };
let request: HistoryAccessRequest | null = null;
let pending: Promise<void> | null = null;
let resolvePending: (() => void) | undefined;
let rejectPending: ((error: Error) => void) | undefined;
const listeners = new Set<() => void>();

export function subscribeHistoryAccess(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function getHistoryAccessRequest() { return request; }

export function askHistoryAccess(mode: HistoryAccessRequest["mode"]): Promise<void> {
  if (pending) return pending;
  pending = new Promise<void>((resolve, reject) => {
    resolvePending = resolve;
    rejectPending = reject;
  });
  request = { mode };
  listeners.forEach(listener => listener());
  return pending;
}

export function finishHistoryAccess(cancelled = false) {
  const resolve = resolvePending;
  const reject = rejectPending;
  request = null;
  pending = null;
  resolvePending = undefined;
  rejectPending = undefined;
  listeners.forEach(listener => listener());
  if (cancelled) reject?.(new Error("Opération annulée : l’historique n’a pas été déverrouillé."));
  else resolve?.();
}
