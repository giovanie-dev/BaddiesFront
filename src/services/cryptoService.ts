// Ces informations peuvent être conservées avec les données chiffrées.
// Le mot de passe et la clé ne font pas partie du résultat.
export type EncryptedData = {
  version: 1;
  iterations: number;
//   sert à fabriquer la clé à partir du mot de passe
  salt: string;
  iv: string;
  ciphertext: string;
};

// Base64 permet de représenter les octets dans un fichier JSON.
function toBase64(bytes: Uint8Array): string {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

/** Chiffre une donnée JSON avec un mot de passe local, sans appel au serveur. */
export async function encryptData(
  data: unknown,
  password: string
): Promise<EncryptedData> {

// outil de chiffrement du nav
  if (!globalThis.crypto?.subtle) {
    throw new Error("Le chiffrement nécessite HTTPS ou localhost.");
  }
  if (password.length < 12) {
    throw new Error("Choisis un mot de passe local d’au moins 12 caractères.");
  }

  const json = JSON.stringify(data);
  if (json === undefined) throw new Error("Cette donnée ne peut pas être chiffrée en JSON.");
  const encoder = new TextEncoder();

  // 1. Générer de nouveaux octets aléatoires à CHAQUE chiffrement.
  // Le sel sert à fabriquer la clé ; l’IV sert à chiffrer ce message.
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const iterations = 600_000;

  // 2. Préparer le mot de passe pour la dérivation de clé.
  const material = await crypto.subtle.importKey(
    "raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]
  );

  // 3. Fabriquer une clé AES de 256 bits. Elle n’est pas exportable.
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // 4. Chiffrer le contenu JSON. AES-GCM protège aussi son intégrité.
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 }, key, encoder.encode(json)
  );

  // 5. Renvoyer uniquement le contenu chiffré et ses paramètres publics.
  return {
    version: 1,
    iterations,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext))
  };
}

// Convertir le texte Base64 enregistré en octets utilisables par le navigateur.
function fromBase64(text: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(text), character => character.charCodeAt(0));
}

/** Retrouve les données JSON avec le mot de passe utilisé au chiffrement. */
export async function decryptData(
  data: EncryptedData,
  password: string
): Promise<unknown> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Le déchiffrement nécessite HTTPS ou localhost.");
  }

  // 1. Vérifier les paramètres avant de lancer le travail de déchiffrement.
  // Cette première version accepte uniquement le format créé par encryptData.
  if (!data || data.version !== 1 || data.iterations !== 600_000 ||
      typeof data.salt !== "string" || typeof data.iv !== "string" ||
      typeof data.ciphertext !== "string") {
    throw new Error("Format des données chiffrées non pris en charge.");
  }

  let salt: Uint8Array<ArrayBuffer>;
  let iv: Uint8Array<ArrayBuffer>;
  let ciphertext: Uint8Array<ArrayBuffer>;
  try {
    salt = fromBase64(data.salt);
    iv = fromBase64(data.iv);
    ciphertext = fromBase64(data.ciphertext);
    if (salt.length !== 16 || iv.length !== 12 || ciphertext.length < 16) {
      throw new Error("Paramètres incomplets.");
    }
  } catch {
    throw new Error("Les données chiffrées sont invalides ou incomplètes.");
  }

  // 2. Refaire la même clé à partir du mot de passe et du sel enregistré.
  const material = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: data.iterations, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  // 3. Déchiffrer. AES-GCM refuse un mauvais mot de passe ou un contenu modifié.
  let plaintext: ArrayBuffer;
  try {
    plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 }, key, ciphertext
    );
  } catch {
    throw new Error("Mot de passe incorrect ou données chiffrées endommagées.");
  }

  // 4. Transformer les octets retrouvés en texte, puis en donnée JSON.
  // Le résultat reste à valider avant de l'utiliser comme une évaluation BADDIES.
  return JSON.parse(new TextDecoder().decode(plaintext));
}
