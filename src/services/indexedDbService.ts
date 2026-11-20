import type { Evaluation } from "../evaluation/EvalContext";
import { encryptData, decryptData, type EncryptedData } from "./cryptoService";
import { askHistoryAccess, finishHistoryAccess } from "./historyAccess";

export type HistoryEvaluation = {
  id: string;
  date: string;
  evaluation?: Evaluation;
  solutions: { 
    id: string; 
    label: string; 
    description: string }[];
  ownerId?: string | null;
};

type ProtectedKeys = { 
  password: EncryptedData; 
  recovery: EncryptedData };

type Vault = { 
  id: "history"; 
  revision: string; 
  payload: EncryptedData; 
  format?: 1 | 2; 
  keys?: ProtectedKeys 
};

export type PreparedHistoryRecovery = {
  code: string;
  // Rien n’est modifié avant cette confirmation explicite de l’interface.
  activate: () => Promise<void>;
};


type Legacy = { 
  rows: unknown[]; 
  raw: string | null; 
  records: HistoryEvaluation[] 
};


export type HistoryVaultStatus = "empty" | "legacy" | "locked" | "unlocked";
export const HISTORY_VAULT_CHANGED = "baddies:history-vault-changed";
export const HISTORY_VAULT_LOCKED = "baddies:history-vault-locked";

const DB_NAME = "baddies-history";
const OLD_STORE = "episodes";
const VAULT_STORE = "encrypted-history";

let opening: Promise<IDBDatabase> | undefined;
// Le secret et les données déchiffrées ne sont jamais enregistrés dans le navigateur.
let session: { 
  secret: string; 
  owner: string | null; 
  revision: string; 
  records: HistoryEvaluation[] 
} | null = null;

let generation = 0;

let operations: Promise<unknown> = Promise.resolve();

// Sérialiser les modifications d’un onglet pour éviter les écrasements.
function exclusive<T>(operation: () => Promise<T>): Promise<T> {
  const next = operations.then(operation, operation);
  operations = next.catch(() => undefined);
  return next;
}

function changed() { 
  window.dispatchEvent(new Event(HISTORY_VAULT_CHANGED)); 
}

const channel = typeof BroadcastChannel !== "undefined" 
? new BroadcastChannel("baddies-history-vault") 
: null;

if (channel){
  channel.onmessage = () => lockHistory();
} 
  

export function currentOwner(): string | null {
  if (!localStorage.getItem("token")) 
    return null;

  try {
    const user = JSON.parse(localStorage.getItem("user") ?? "null");
    
    return user?.id != null 
          ? String(user.id) 
          : null;
  } catch { 
    return null; 
  }
}

export function lockHistory(): void {
  session = null;
  generation++;
  finishHistoryAccess(true);
  changed();
  window.dispatchEvent(new Event(HISTORY_VAULT_LOCKED));
}

export function isHistoryUnlocked(): boolean {
  return session !== null && session.owner === currentOwner();
}

export class HistoryLockedError extends Error {
  constructor() { super("Déverrouille ton historique avec ton mot de passe local."); }
}

function checkSession() {
  if (session && session.owner !== currentOwner()) lockHistory();
  if (!session) throw new HistoryLockedError();
  return session;
}

function openDatabase(): Promise<IDBDatabase> {
  if (!opening) opening = new Promise<IDBDatabase>((resolve, reject) => {
    
    let blocked = false;

    const request = indexedDB.open(DB_NAME, 2);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(OLD_STORE)) db.createObjectStore(OLD_STORE, { keyPath: "id" });

      if (!db.objectStoreNames.contains(VAULT_STORE)) db.createObjectStore(VAULT_STORE, { keyPath: "id" });
    };

    request.onerror = () => reject(request.error);
    request.onblocked = () => { blocked = true; reject(new Error("Ferme les autres onglets BADDIES puis réessaie.")); };
    request.onsuccess = () => {

      const db = request.result;

      if (blocked) { db.close(); return; }
      db.onversionchange = () => { lockHistory(); db.close(); opening = undefined; };
      resolve(db);
    };
  }).catch(error => { opening = undefined; throw error; });
  return opening;
}

async function read<T>(store: string, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const request = action(tx.objectStore(store));
    tx.oncomplete = () => resolve(request.result);
    tx.onabort = () => reject(tx.error ?? new Error("Lecture locale interrompue."));
    tx.onerror = () => reject(tx.error ?? request.error);
  });
}

const readVault = () => read<Vault | undefined>(VAULT_STORE, store => store.get("history"));
const isObject = (value: unknown): 
      value is Record<string, unknown> => typeof value === "object" && value !== null;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(x => typeof x === "string");
const nullableString = (value: unknown) => value === null || typeof value === "string";

// Ne pas faire confiance au JSON déchiffré ni aux anciennes données locales.
function parseHistory(value: unknown): HistoryEvaluation[] {
  if (!Array.isArray(value))
     throw new Error("Historique invalide : aucune donnée n’a été effacée.");

  const result: HistoryEvaluation[] = [];
  const ids = new Set<string>();

  for (const item of value) {
    if (!isObject(item) 
      || typeof item.id !== "string" 
      || !item.id 
      || ids.has(item.id) 
      || typeof item.date !== "string" 
      || !Number.isFinite(Date.parse(item.date)) 
      || !Array.isArray(item.solutions) 
      || (item.ownerId != null && typeof item.ownerId !== "string")) {
      throw new Error("Une évaluation est illisible : les données d’origine ont été      conservées.");
    }

    for (const solution of item.solutions) {
      if (!isObject(solution) || typeof solution.id !== "string" || typeof solution.label !== "string" || typeof solution.description !== "string") {
        throw new Error("Les conseils enregistrés sont invalides.");
      }
    }
    if (item.evaluation !== undefined) {
      const e = item.evaluation;
      if (!isObject(e) 
        || !nullableString(e.intensiteNiveau) 
        || !nullableString(e.contextes) 
        || !nullableString(e.option) 
        || !(e.intensiteValeur === null 
        || (typeof e.intensiteValeur === "number" &&
          Number.isFinite(e.intensiteValeur))) 
        || !strings(e.localisations) 
        || !strings(e.symptomes)) {
          throw new Error("Les réponses enregistrées sont invalides.");
        }
    }

    ids.add(item.id);
    // Liste blanche : ne pas conserver d’anciennes métadonnées de synchronisation.
    result.push({ 
      id: item.id, 
      date: item.date, 
      solutions: structuredClone(item.solutions),
      ownerId: item.ownerId ?? null, 
      ...(item.evaluation === undefined ? {} : { evaluation: structuredClone(item.evaluation) }) } as HistoryEvaluation);
  }
  return result;
}

async function legacySnapshot(): Promise<Legacy> {
  const rows = await read<unknown[]>(OLD_STORE, store => store.getAll());
  const raw = localStorage.getItem("historique");
  const records = parseHistory(rows);

  if (raw) {
    const old = parseHistory(JSON.parse(raw));
    for (const item of old) if (!records.some(row => row.id === item.id)) records.push({ ...item, ownerId: null });
  }
  return { rows, raw, records };
}

// Écriture atomique : vérifier la révision pour ne pas écraser un autre onglet.
// Pendant la migration, remplacer les données en clair dans la même transaction.
async function commit(expected: Vault | undefined, payload: EncryptedData, 
  legacy?: Legacy, 
  keys?: ProtectedKeys)
  : Promise<Vault> {
    
  const db = await openDatabase();
  const next: Vault = { id: "history", revision: crypto.randomUUID(), payload, format: keys ? 2 : 1, ...(keys ? { keys } : {}) };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([VAULT_STORE, OLD_STORE], "readwrite");
    const store = tx.objectStore(VAULT_STORE);
    const current = store.get("history");
    const old = tx.objectStore(OLD_STORE).getAll();
    let failure: Error | undefined;
    let ready = 0;
    const write = () => {
      if (++ready !== 2) return;
      if (current.result?.revision !== expected?.revision ||
          (legacy && (JSON.stringify(old.result) !== JSON.stringify(legacy.rows) || localStorage.getItem("historique") !== legacy.raw))) {
        failure = new Error("L’historique a changé dans un autre onglet. Réessaie après l’avoir fermé.");
        tx.abort(); return;
      }
      try {
        store.put(next);
        if (legacy) tx.objectStore(OLD_STORE).clear();
      } catch {
        failure = new Error("L’écriture chiffrée a échoué : les données d’origine ont été conservées.");
        tx.abort();
      }
    };
    current.onsuccess = write;
    old.onsuccess = write;
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(failure ?? tx.error ?? new Error("Enregistrement chiffré annulé."));
    tx.onerror = () => reject(tx.error ?? new Error("Impossible d’enregistrer l’historique chiffré."));
  });
  // Ne retirer la copie localStorage qu’APRÈS confirmation du commit chiffré.
  if (legacy?.raw && localStorage.getItem("historique") === legacy.raw) localStorage.removeItem("historique");
  channel?.postMessage("changed");
  return next;
}

export async function getHistoryVaultStatus(): Promise<HistoryVaultStatus> {
  if (session && session.owner !== currentOwner()) lockHistory();
  if (session) return "unlocked";
  if (await readVault()) return "locked";
  const count = await read<number>(OLD_STORE, store => store.count());
  return count || localStorage.getItem("historique") ? "legacy" : "empty";
}

// La clé aléatoire de l’historique est protégée par deux secrets indépendants.
// Aucun code de récupération en clair n’est conservé dans IndexedDB.
function randomSecret(): string {
  return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
}

function recoveryCode(): string {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return hex.match(/.{8}/g)!.join("-");
}

function normalizeRecoveryCode(code: string): string {
  const normalized = code.replace(/[\s-]/g, "").toUpperCase();
  if (!/^[A-F0-9]{64}$/.test(normalized)) throw new Error("Le code de récupération doit contenir ses 8 groupes de 8 caractères.");
  return normalized;
}

function protectedKeys(vault: Vault): ProtectedKeys | undefined {
  if (vault.format === undefined || vault.format === 1) return undefined;
  if (vault.format !== 2 || !vault.keys?.password || !vault.keys?.recovery) throw new Error("La protection de cet historique est invalide.");
  return vault.keys;
}

function validateSecret(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9+/]{43}=$/.test(value)) throw new Error("La clé de l’historique est invalide.");
  return value;
}

export async function hasHistoryRecovery(): Promise<boolean> {
  const vault = await readVault();
  return !!vault && !!protectedKeys(vault);
}

// Préparer puis confirmer évite d’activer un code avant qu’il soit conservé.
function prepareActivation(
  code: string, secret: string, records: HistoryEvaluation[], payload: EncryptedData,
  keys: ProtectedKeys, expected: Vault | undefined, legacy: Legacy | undefined,
  epoch: number, owner: string | null
): PreparedHistoryRecovery {
  let activated = false;
  return { code, activate: () => exclusive(async () => {
    if (activated) throw new Error("Ce code a déjà été activé.");
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    const saved = await commit(expected, payload, legacy, keys);
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    activated = true;
    session = { secret, owner, revision: saved.revision, records };
    changed();
  }) };
}

export function createHistoryVault(password: string): Promise<PreparedHistoryRecovery> {
  const epoch = generation;
  const owner = currentOwner();
  return exclusive(async () => {
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    if (await readVault()) throw new Error("Une protection existe déjà. Utilise Déverrouiller.");
    const legacy = await legacySnapshot();
    const secret = randomSecret();
    const code = recoveryCode();
    const [passwordAccess, recoveryAccess, payload] = await Promise.all([
      encryptData(secret, password),
      encryptData(secret, normalizeRecoveryCode(code)),
      encryptData(legacy.records, secret)
    ]);
    parseHistory(await decryptData(payload, secret));
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    return prepareActivation(code, secret, legacy.records, payload,
      { password: passwordAccess, recovery: recoveryAccess }, undefined, legacy, epoch, owner);
  });
}

export function unlockHistoryVault(password: string): Promise<void> {
  const epoch = generation;
  const owner = currentOwner();
  return exclusive(async () => {
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    let vault = await readVault();
    if (!vault) throw new Error("Aucune protection n’existe encore sur cet appareil.");
    const keys = protectedKeys(vault);
    // Compatibilité avec l’historique déjà chiffré directement par l’ancien mot de passe.
    const secret = keys ? validateSecret(await decryptData(keys.password, password)) : password;
    const records = parseHistory(await decryptData(vault.payload, secret));
    const legacy = await legacySnapshot();
    for (const item of legacy.records) if (!records.some(row => row.id === item.id)) records.push(item);
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    if (legacy.rows.length || legacy.raw) {
      const payload = await encryptData(records, secret);
      if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
      vault = await commit(vault, payload, legacy, keys);
    }
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    session = { secret, owner, revision: vault.revision, records };
    changed();
  });
}

// Créer/renouveler un code nécessite une session locale déjà déverrouillée.
// Un ancien coffre est converti sans perdre les évaluations ni changer son mot de passe.
export function prepareHistoryRecovery(): Promise<PreparedHistoryRecovery> {
  const epoch = generation;
  const owner = currentOwner();
  return exclusive(async () => {
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    const access = checkSession();
    const vault = await readVault();
    if (!vault || vault.revision !== access.revision) { lockHistory(); throw new HistoryLockedError(); }
    const existingKeys = protectedKeys(vault);
    const records = structuredClone(access.records);
    const secret = existingKeys ? access.secret : randomSecret();
    const code = recoveryCode();
    const [passwordAccess, recoveryAccess, payload] = await Promise.all([
      existingKeys ? Promise.resolve(existingKeys.password) : encryptData(secret, access.secret),
      encryptData(secret, normalizeRecoveryCode(code)),
      existingKeys ? Promise.resolve(vault.payload) : encryptData(records, secret)
    ]);
    parseHistory(await decryptData(payload, secret));
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    return prepareActivation(code, secret, records, payload,
      { password: passwordAccess, recovery: recoveryAccess }, vault, undefined, epoch, owner);
  });
}

export function recoverHistoryVault(code: string, newPassword: string): Promise<void> {
  const epoch = generation;
  const owner = currentOwner();
  return exclusive(async () => {
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    if (newPassword.length < 12) throw new Error("Choisis un nouveau mot de passe local d’au moins 12 caractères.");
    const vault = await readVault();
    if (!vault) throw new Error("L’historique est absent de ce navigateur. Un code seul ne restaure pas des données effacées.");
    const keys = protectedKeys(vault);
    if (!keys) throw new Error("Aucun code de récupération n’a été activé pour cet ancien historique. Son mot de passe local reste nécessaire.");
    let secret: string;
    try {
      secret = validateSecret(await decryptData(keys.recovery, normalizeRecoveryCode(code)));
    } catch {
      throw new Error("Code de récupération incorrect ou protection endommagée.");
    }
    const records = parseHistory(await decryptData(vault.payload, secret));
    const legacy = await legacySnapshot();
    for (const item of legacy.records) if (!records.some(row => row.id === item.id)) records.push(item);
    const [passwordAccess, payload] = await Promise.all([
      encryptData(secret, newPassword),
      legacy.rows.length || legacy.raw ? encryptData(records, secret) : Promise.resolve(vault.payload)
    ]);
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    const saved = await commit(vault, payload, legacy, { password: passwordAccess, recovery: keys.recovery });
    if (epoch !== generation || owner !== currentOwner()) throw new HistoryLockedError();
    session = { secret, owner, revision: saved.revision, records };
    changed();
  });
}

// Seule une action explicite (enregistrer/déverrouiller) ouvre le formulaire.
export async function ensureHistoryUnlocked(): Promise<void> {
  if (session && session.owner === currentOwner()) return;
  const status = await getHistoryVaultStatus();
  await askHistoryAccess(status === "locked" ? "unlock" : "create");
  checkSession();
}

export function getEvaluations(): Promise<HistoryEvaluation[]> {
  return exclusive(async () => {
    if (!session) {
      if (await getHistoryVaultStatus() === "empty") return [];
      throw new HistoryLockedError();
    }
    const access = checkSession();
    const vault = await readVault();
    if (!vault || vault.revision !== access.revision) { lockHistory(); throw new HistoryLockedError(); }
    checkSession();
    return structuredClone(access.records.filter(item => item.ownerId == null || item.ownerId === access.owner));
  });
}

async function modifyHistory(update: (records: HistoryEvaluation[], owner: string | null) => HistoryEvaluation[]): Promise<void> {
  const access = checkSession();
  const epoch = generation;
  const vault = await readVault();
  if (!vault || vault.revision !== access.revision) { lockHistory(); throw new HistoryLockedError(); }
  const records = parseHistory(update(structuredClone(access.records), access.owner));
  const payload = await encryptData(records, access.secret);
  if (epoch !== generation || access.owner !== currentOwner()) throw new HistoryLockedError();
  const saved = await commit(vault, payload, undefined, protectedKeys(vault));
  if (epoch !== generation || access.owner !== currentOwner()) throw new HistoryLockedError();
  session = { ...access, records, revision: saved.revision };
  changed();
}

export async function putEvaluation(item: HistoryEvaluation): Promise<void> {
  const safe = parseHistory([item])[0];
  const owner = currentOwner();
  if (safe.ownerId != null && safe.ownerId !== owner) throw new Error("Cet épisode appartient à un autre compte.");
  await ensureHistoryUnlocked();
  return exclusive(async () => {
    if (owner !== currentOwner()) throw new HistoryLockedError();
    await modifyHistory(records => {
      const index = records.findIndex(row => row.id === safe.id);
      if (index >= 0 && records[index].ownerId != null && records[index].ownerId !== owner) throw new Error("Épisode inaccessible.");
      if (index >= 0) records[index] = safe;
      else records.push(safe);
      return records;
    });
  });
}

export async function saveEvaluation(evaluation: Evaluation, solutions: HistoryEvaluation["solutions"]): Promise<HistoryEvaluation> {
  const item = { id: crypto.randomUUID(), date: new Date().toISOString(),
    evaluation: structuredClone(evaluation), solutions: structuredClone(solutions), ownerId: currentOwner() };
  await putEvaluation(item);
  return item;
}

export async function deleteEvaluation(id: string): Promise<void> {
  await ensureHistoryUnlocked();
  return exclusive(() => modifyHistory((records, owner) => records.filter(item =>
    item.id !== id || (item.ownerId != null && item.ownerId !== owner))));
}

export async function deleteAccountEvaluations(): Promise<void> {
  const owner = currentOwner();
  if (!owner || await getHistoryVaultStatus() === "empty") return;
  await ensureHistoryUnlocked();
  return exclusive(async () => {
    if (owner !== currentOwner()) throw new HistoryLockedError();
    await modifyHistory(records => records.filter(item => item.ownerId !== owner));
  });
}

export async function getEvaluationById(id: string): Promise<HistoryEvaluation | null> {
  return (await getEvaluations()).find(item => item.id === id) ?? null;
}
