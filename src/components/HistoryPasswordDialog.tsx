import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { finishHistoryAccess, getHistoryAccessRequest, subscribeHistoryAccess, type HistoryAccessRequest } from "../services/historyAccess";
import { createHistoryVault, unlockHistoryVault, prepareHistoryRecovery, recoverHistoryVault, type PreparedHistoryRecovery } from "../services/indexedDbService";
import "../styles/components/historyVault.scss";

function PasswordForm({ mode }: HistoryAccessRequest) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [recoveryInput, setRecoveryInput] = useState("");
  const [forgotten, setForgotten] = useState(false);
  const [prepared, setPrepared] = useState<PreparedHistoryRecovery | null>(null);
  const [savedCode, setSavedCode] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const creating = mode === "create";
  const generating = mode === "recovery";
  const newPassword = creating || forgotten;
  useEffect(() => { dialog.current?.showModal(); }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (prepared && !savedCode) { setError("Conserve ton code avant de confirmer son activation."); return; }
    if (!prepared && newPassword && password !== confirmation) { setError("Les deux mots de passe sont différents."); return; }
    setBusy(true);
    try {
      if (prepared) {
        await prepared.activate();
        setPrepared(null);
        finishHistoryAccess();
      } else if (forgotten) {
        await recoverHistoryVault(recoveryInput, password);
        setRecoveryInput(""); setPassword(""); setConfirmation("");
        finishHistoryAccess();
      } else if (creating || generating) {
        const next = creating ? await createHistoryVault(password) : await prepareHistoryRecovery();
        setPrepared(next); setPassword(""); setConfirmation(""); setSavedCode(false);
      } else {
        await unlockHistoryVault(password);
        setPassword("");
        finishHistoryAccess();
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Impossible d’ouvrir l’historique.");
      setPassword(""); setConfirmation("");
    } finally { setBusy(false); }
  };

  const copyCode = async () => {
    if (!prepared) return;
    try { await navigator.clipboard.writeText(prepared.code); setCopyMessage("Code copié. Conserve-le dans un endroit sûr."); }
    catch { setCopyMessage("Copie le code affiché ou utilise le téléchargement."); }
  };
  const downloadCode = () => {
    if (!prepared) return;
    const text = `Code de récupération de l’historique local BADDIES\n\n${prepared.code}\n\nÀ conserver séparément, dans un endroit sûr.\nCe code permet de remplacer le mot de passe local. Il ne restaure pas un historique effacé du navigateur.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "BADDIES-code-recuperation.txt";
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCopyMessage("Conserve le fichier dans un endroit sûr, séparément de ton historique.");
  };
  const switchForgotten = (value: boolean) => {
    setForgotten(value); setPassword(""); setConfirmation(""); setRecoveryInput(""); setError(""); setShow(false);
  };

  const title = prepared ? "Conserve ton code de récupération" : forgotten ? "Récupérer mon historique" : generating ? "Code de récupération" : creating ? "Protéger mon historique" : "Déverrouiller mon historique";
  return <dialog ref={dialog} className="history-password-dialog" aria-labelledby="history-password-title" aria-describedby="history-password-description" aria-busy={busy}
    onClick={event => {
      if (busy || event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) finishHistoryAccess(true);
    }}
    onCancel={event => { event.preventDefault(); if (!busy) finishHistoryAccess(true); }}>
    <form onSubmit={submit}>
      <h2 id="history-password-title">{title}</h2>
      <p id="history-password-description">{prepared ? "Ce code permet de retrouver l’accès si tu oublies ton mot de passe local.  Conserve-le séparément." : forgotten ? "Saisis le code conservé lors de l’activation de la récupération." : generating ? "Un nouveau code sera proposé. Il remplacera le précédent uniquement lorsque tu confirmeras l’avoir conservé. Ton mot de passe local et tes évaluations seront conservés." : creating ? "Choisis un mot de passe local distinct de celui du compte BADDIES. ." : "Utilise le mot de passe local choisi pour cet historique"}</p>

      {prepared ? <>
        <label htmlFor="history-recovery-output">Ton code de récupération</label>
        <textarea id="history-recovery-output" className="history-recovery-code" value={prepared.code} readOnly rows={4} spellCheck={false} autoComplete="off" />
        <div className="history-password-actions">
          <button type="button" onClick={copyCode} disabled={busy}>Copier le code</button>
          <button type="button" onClick={downloadCode} disabled={busy}>Télécharger le code</button>
        </div>
        {copyMessage && <p role="status">{copyMessage}</p>}
        {/* <p className="history-password-warning">Toute personne possédant ce code et ton historique chiffré peut retrouver l’accès. Le code seul ne récupère pas les données effacées du navigateur.</p> */}
        <label className="history-checkbox"><input type="checkbox" checked={savedCode} onChange={event => setSavedCode(event.target.checked)} required disabled={busy} />J’ai conservé mon code de récupération.</label>
      </> : <>

        {forgotten && <>
          <label htmlFor="history-recovery-input">Code de récupération</label>
          <input id="history-recovery-input" type={show ? "text" : "password"} value={recoveryInput}
            onChange={event => setRecoveryInput(event.target.value)} required disabled={busy} autoComplete="off" spellCheck={false} autoCapitalize="characters" autoFocus />
          <small>8 groupes de 8 caractères. Vous pouvez coller le code avec ses tirets.</small>
        </>}
        {!generating && <>
          <label htmlFor="history-local-password">{forgotten ? "Nouveau mot de passe local" : "Mot de passe local"}</label>
          <input id="history-local-password" type={show ? "text" : "password"} value={password}
            onChange={event => setPassword(event.target.value)} minLength={newPassword ? 12 : undefined} required
            autoComplete={newPassword ? "new-password" : "current-password"} autoFocus={!forgotten} disabled={busy} spellCheck={false} autoCapitalize="none" />
          {newPassword && <>
            <small>Au moins 12 caractères.</small>
            <label htmlFor="history-confirm-password">Confirmer le mot de passe local</label>
            <input id="history-confirm-password" type={show ? "text" : "password"} value={confirmation}
              onChange={event => setConfirmation(event.target.value)} autoComplete="new-password" required minLength={12} disabled={busy} spellCheck={false} autoCapitalize="none" />
          </>}
          <label className="history-checkbox"><input type="checkbox" checked={show} onChange={event => setShow(event.target.checked)} disabled={busy} />{forgotten ? "Afficher le code et le mot de passe" : "Afficher le mot de passe"}</label>
        </>}
        {!creating && !generating && <button type="button" className="history-forgot-password" disabled={busy} onClick={() => switchForgotten(!forgotten)}>
          {forgotten ? "Revenir au déverrouillage" : "Mot de passe local oublié ?"}
        </button>}
        <p className="history-password-warning">{forgotten ? "Si aucun code n’a été activé auparavant, le mot de passe local reste nécessaire. Sans les deux, l’historique est inaccessible." : "La réinitialisation du compte ne récupère pas l’historique local. Sans ton mot de passe ni ton code de récupération, l’accès est perdu."}</p>
      </>}
      {error && <p role="alert" className="history-password-error">{error}</p>}
      <p role="status" aria-live="polite">{busy ? "Protection de l’historique en cours. Garde cet onglet ouvert…" : ""}</p>
      <div className="history-password-actions">
        <button type="button" disabled={busy} onClick={() => finishHistoryAccess(true)}>Annuler</button>
        <button type="submit" disabled={busy}>{prepared ? "J’ai conservé mon code, activer" : forgotten ? "Récupérer et changer le mot de passe" : generating ? "Générer un nouveau code" : creating ? "Continuer" : "Déverrouiller"}</button>
      </div>
    </form>
  </dialog>;
}

export default function HistoryPasswordDialog() {
  const request = useSyncExternalStore(subscribeHistoryAccess, getHistoryAccessRequest, () => null);
  return request ? <PasswordForm key={request.mode} mode={request.mode} /> : null;
}
