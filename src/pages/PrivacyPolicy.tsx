import Navbar from "../components/Navbar";
import "../styles/pages/legalePrivacy.scss";
import { Link } from "react-router-dom";
export default function Privacy() {
  return (
    <>
      <Navbar />
      <main className="legal-page">
        <h1>POLITIQUE DE CONFIDENTIALITÉ</h1>

        <p>Dernière mise à jour : <span className="date">18 novembre 2026</span> </p>

        <p>
          La présente politique de confidentialité décrit la manière
          dont les données personnelles des utilisateurs de BADDIES,
          accessible à l'adresse {" "}
          <a href="https://baddies-beryl.vercel.app/">
            https://baddies-beryl.vercel.app/
          </a>
          , sont collectées, utilisées et protégées conformément
          au Règlement général sur la protection des données (RGPD)
          et à la loi Informatique et Libertés.
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          La responsable du traitement est Giovanie ANDRIANIRINA,
          éditrice de l'application BADDIES.
        </p>
        <p> Pour toute question relative aux données personnelles :
          {" "}
          <a href="mailto:giovanieandrianirina@gmail.com">
            giovanieandrianirina@gmail.com
          </a>
        </p>

        <h2>2. Données personnelles collectées</h2>
        <p>
          Selon les fonctionnalités utilisées, BADDIES peut traiter
          les catégories de données suivantes :
        </p>
        <ul>
          <li>
            Données de compte : pseudonyme, adresse e-mail, éventuel avatar
            et informations nécessaires à l’authentification. Le serveur conserve
            une empreinte du mot de passe du compte, et non ce mot de passe en clair.
          </li>
          <li>
            Données d'évaluation : intensité des douleurs menstruelles,
            localisation, symptômes associés, contexte et
            caractéristiques de la douleur.
          </li>
          <li>
            Historique des évaluations enregistré uniquement sur cet appareil.
          </li>
          <li>
            Préférences et choix : pays, tranche d'âge déclarée et
            consentements. Si vous ajoutez un contact d'urgence,
            son nom et son numéro de téléphone sont enregistrés sur l'appareil.
          </li>
          <li>
            Données de mesure d'audience lorsque vous acceptez Google Analytics :
            informations de navigation et données techniques associées.
          </li>
          <li>
            Données techniques nécessaires au fonctionnement
            et à la sécurité de l'application.
          </li>
        </ul>
        <p>
          Les informations relatives aux douleurs et aux symptômes
          peuvent constituer des données de santé sensibles
          au sens du RGPD.
        </p>

        <h2>3. Finalités du traitement</h2>
        <p>
          Les données personnelles sont traitées pour les
          finalités suivantes :
        </p>
        <ul>
          <li>Créer et gérer les comptes utilisateurs.</li>
          <li>Permettre l'authentification et la connexion.</li>
          <li>
            Réaliser les évaluations des douleurs menstruelles.
          </li>
          <li>
            Présenter des conseils adaptés aux réponses fournies.
          </li>
          <li>
            Permettre la consultation de l'historique
            des évaluations enregistrées.
          </li>
          <li>
            Envoyer des e-mails nécessaires à la gestion du compte.
          </li>
          <li>
            Mesurer la fréquentation des pages suivies pour comprendre
            l'utilisation du service, uniquement avec votre accord pour Analytics.
          </li>
          <li>
            Assurer la sécurité et le bon fonctionnement
            de l'application.
          </li>
        </ul>
        <p>
          BADDIES est une application d'accompagnement et
          d'information. Elle ne réalise aucun diagnostic médical
          et ne remplace pas un professionnel de santé.
        </p>

        <h2>4. Bases légales et données de santé</h2>
        <p>
          Chaque traitement de données personnelles doit reposer
          sur une base légale appropriée, conformément à
          l'article 6 du RGPD.
        </p>
        <p>
          La création du compte, la connexion et la gestion du profil répondent
          à votre demande de service et reposent sur l’exécution du contrat
          (article 6, paragraphe 1, point b). La protection des comptes contre
          les accès non autorisés répond à l’intérêt légitime de sécuriser
          le service (article 6, paragraphe 1, point f).
        </p>
        <p>
          Le traitement des réponses à l'évaluation et des données
          de santé associées repose sur votre consentement,
          conformément à l'article 6, paragraphe 1, point a,
          et sur votre consentement explicite conformément
          à l'article 9, paragraphe 2, point a, du RGPD.
          Cet accord est demandé avant l'évaluation.
        </p>

        <p>
          Le consentement aux statistiques Google Analytics est distinct de celui
          concernant les données de santé. Vous pouvez refuser les statistiques
          sans renoncer à l'évaluation. Les réglages correspondants sont décrits
          dans la section 7.
        </p>

        <h2>5. Durée de conservation</h2>

        <h3>Données conservées sur votre appareil</h3>
        <p>
          Les évaluations sauvegardées localement, les préférences,
          les choix de consentement et les coordonnées d'un éventuel
          contact d'urgence restent dans le stockage du navigateur
          jusqu'à leur suppression par les fonctions disponibles
          dans l'application ou par l'effacement des données du site.
          Le navigateur peut également supprimer ces données selon
          ses propres règles.
        </p>
        <p>
          La fermeture du navigateur ou la déconnexion ne supprime
          pas automatiquement l'ensemble de ces informations.
          Effacer les données locales ne supprime pas celles déjà
          enregistrées sur le compte.
        </p>

        <h3>Données du compte</h3>
        <p>
          Les informations de compte restent conservées tant qu'elles n'ont pas été
          supprimées. La version actuelle ne prévoit pas de suppression
          automatique des comptes inactifs.
          Vous pouvez demander l'effacement de votre compte et des
          données associées au contact indiqué dans la section 9.
          Vous pouvez supprimer votre compte depuis les paramètres, après confirmation de votre mot de passe.
        </p>
        {/* À FINALISER AVANT PUBLICATION : définir et appliquer les durées
          maximales des comptes, y compris en cas
          d'inactivité. Le constat ci-dessus ne remplace pas cette règle. */}

        <h3>Authentification et réinitialisation du mot de passe</h3>
        <p>
          Le jeton d'accès est valable 15 minutes. Le jeton de
          renouvellement est valable 7 jours et peut être remplacé
          ou révoqué avant son expiration. Un lien de réinitialisation
          du mot de passe est valable une heure et ne peut plus être
          utilisé après une réinitialisation réussie.
        </p>
        <p>
          Ces durées concernent la validité des jetons. Leur expiration
          ne correspond pas nécessairement à la suppression immédiate
          de leurs enregistrements dans la base de données.
        </p>

        {/* À FINALISER AVANT PUBLICATION : vérifier et documenter le nettoyage
          des jetons expirés, utilisés ou révoqués. */}

        <h3>Google Analytics</h3>
        <p>
          Lorsque vous acceptez Google Analytics, les données d'événements
          concernées par ses paramètres de conservation sont conservées
          pendant 2 mois et les données utilisateur concernées pendant
          14 mois. Ces paramètres ne déterminent pas la durée de
          conservation de la plupart des rapports standards fondés sur
          des données agrégées, ni la durée de vie des cookies.
        </p>

        {/* À VÉRIFIER AVANT PUBLICATION : état de l'option de réinitialisation
          de la conservation à chaque nouvelle activité, et durées des cookies. */}

        <h3>Journaux techniques et sauvegardes</h3>
        <p>
          Les services techniques peuvent conserver des journaux de
          fonctionnement et des copies de sauvegarde. La suppression
          d'une donnée dans l'application ne signifie pas son effacement
          immédiat de toutes les sauvegardes.
        </p>
        {/* À FINALISER AVANT PUBLICATION : vérifier l'existence des sauvegardes,
          leurs durées et cycles de rotation ainsi que la conservation des
          journaux de BADDIES et des prestataires ; préciser ici les valeurs. */}

        <h3>Copies téléchargées ou partagées</h3>
        <p>
          Un PDF téléchargé ou un résumé partagé constitue une copie
          distincte. Supprimer une évaluation dans BADDIES ne supprime
          pas les fichiers présents sur votre appareil ni les copies
          déjà transmises à des tiers.
        </p>

        <h2>6. Hébergement, destinataires et prestataires</h2>
        <p>
          Les données sont traitées par la responsable du traitement
          et, dans la mesure nécessaire à leurs missions respectives,
          par les prestataires techniques suivants :
        </p>
        <ul>
          <li>
            <strong>Vercel :</strong> hébergement et diffusion de
            l'interface web.{' '}
            <a href="https://vercel.com/legal/privacy-notice">
              Politique de confidentialité de Vercel
            </a>.
          </li>
          <li>
            <strong>Render :</strong> hébergement de l'API backend,
            qui traite l’authentification et la gestion du profil, sans recevoir l’historique des évaluations.{' '}
            <a href="https://render.com/privacy">
              Politique de confidentialité de Render
            </a>.
          </li>
          <li>
            <strong>Supabase :</strong> hébergement de la base PostgreSQL
            contenant les données de compte, les éléments nécessaires
            à l’authentification. Aucune date d’évaluation, réponse ou solution n’y est envoyée par cette version.{' '}
            <a href="https://supabase.com/privacy">
              Politique de confidentialité de Supabase
            </a>.
          </li>
          <li>
            <strong>Brevo :</strong> envoi des e-mails transactionnels,
            notamment de réinitialisation du mot de passe. Les informations
            traitées pour cet envoi comprennent l'adresse du destinataire
            et le contenu du message, dont le lien de réinitialisation.{' '}
            <a href="https://www.brevo.com/fr/legal/privacypolicy/">
              Politique de confidentialité de Brevo
            </a>.
          </li>
          <li>
            <strong>Google Analytics 4 :</strong> mesure d'audience
            facultative après votre accord, selon les modalités
            de la section 7.{' '}
            <a href="https://policies.google.com/privacy">
              Politique de confidentialité de Google
            </a>.
          </li>
        </ul>

        <h3>Localisation et transferts de données</h3>
        <p>
          L'API backend est hébergée par Render dans la région
          Oregon (US West), aux États-Unis. La base PostgreSQL
          est hébergée par Supabase dans la région eu-west-1,
          en Irlande, dans l'Union européenne.
        </p>
        <p>
          Les données envoyées à l'API sont traitées par le backend
          situé aux États-Unis, même lorsque leur stockage en base
          de données est effectué en Irlande. L'hébergement européen
          de la base ne signifie donc pas que tous les traitements
          sont réalisés dans l'Espace économique européen.
        </p>
        <p>
          Les services de diffusion, de support, d'envoi d'e-mails et
          de mesure d'audience peuvent également impliquer des traitements
          ou des accès en dehors de l'Espace économique européen.
        </p>

        {/* À FINALISER AVANT PUBLICATION : identifier les autres destinations
          effectives et vérifier les garanties applicables aux transferts
          (décision d'adéquation applicable à l'entité concernée, ou clauses
          contractuelles types et mesures complémentaires si nécessaires).
          Ne pas présenter une garantie comme acquise sans cette vérification. */}
        <p>
          Pour toute question sur les destinataires et les transferts
          de vos données, vous pouvez contacter la responsable
          du traitement à l'adresse indiquée dans la section 9.
        </p>
        <h2>7. Stockage des données et choix de consentement</h2>

        <h3>Évaluations et historique local chiffré</h3>
        <p>
          Les réponses au questionnaire sont utilisées dans le navigateur pour
          proposer des conseils. Lorsque vous sauvegardez une évaluation,
          sa date, les réponses et les solutions associées sont enregistrées
          dans IndexedDB, sur cet appareil. Avec ou sans compte, cette version
          n’envoie aucune de ces données d’historique à l’API ou à Supabase.
        </p>
        <p>
          L’historique sauvegardé est chiffré avec AES-GCM. Un mot de passe
          local protège l’accès à sa clé de chiffrement. Il est distinct du
          mot de passe du compte : changer ou réinitialiser le mot de passe
          du compte ne déverrouille pas l’historique.
        </p>
        <p>
          Pendant le déverrouillage, les données lisibles et la clé nécessaire
          à leur utilisation sont présentes en mémoire. L’historique se verrouille
          au rechargement de la page, à la déconnexion, au changement de compte
          ou après 10 minutes d’inactivité. Vous pouvez aussi le verrouiller
          immédiatement depuis la page Suivi. Le verrouillage n’efface pas
          l’historique chiffré du navigateur.
        </p>
        <h3>Mot de passe local oublié et code de récupération</h3>
        <p>
          Un code de récupération peut être activé après confirmation que vous
          l’avez conservé. Il permet de définir un nouveau mot de passe local
          pour un historique encore présent sur cet appareil. Le mot de passe
          local, le code et la clé de l’historique ne sont pas envoyés au serveur.
          BADDIES ne les conserve pas en clair dans son stockage persistant.
        </p>
        <p>
          Le code copié ou téléchargé est un secret lisible : conservez-le dans
          un endroit sûr, séparément de l’appareil si possible. Une personne
          disposant du code et de votre historique chiffré peut le déverrouiller.
          Ce fichier contient le code, pas vos évaluations : ce n’est pas une
          sauvegarde de l’historique. Le code ne restaure pas des données effacées.
        </p>
        <p>
          Sans mot de passe local ni code de récupération déjà activé et conservé,
          BADDIES ne peut pas rétablir l’accès. Pour un ancien historique chiffré,
          le code doit être activé après déverrouillage, avant un éventuel oubli.
          Vous pouvez renouveler le code depuis la protection de l’historique ;
          le remplacement ne s’applique qu’après confirmation de sa conservation.
        </p>
        <h3>Limites et anciens historiques</h3>
        <p>
          Les anciens historiques locaux en clair sont convertis lors de
          l’activation réussie de la protection. Tant que cette étape n’est
          pas terminée, les données d’origine restent présentes pour éviter
          leur perte. Fermez les anciens onglets de BADDIES avant cette opération.
        </p>
        <p>
          La protection porte sur un historique dans un profil de navigateur,
          et non sur un coffre chiffré distinct pour chaque compte. Sur un
          appareil partagé, utilisez des profils de navigateur séparés.
          Le chiffrement ne protège pas une session déjà déverrouillée contre
          une personne utilisant l’appareil ou un programme malveillant.
        </p>
        <h3>Absence de synchronisation et suppression</h3>
        <p>
          La connexion au compte ne transfère pas l’historique : un autre appareil
          ne retrouve ni ses dates, ni ses réponses, ni ses conseils.
          Effacer les données du site ou perdre l’appareil peut rendre cet
          historique irrécupérable, même avec le code de récupération.
          Un bilan PDF conservé séparément reste une copie de lecture ;
          il ne permet pas de réimporter l’historique dans BADDIES.
        </p>
        <p>
          Vous pouvez supprimer une évaluation depuis l’application après
          déverrouillage. La suppression du compte, depuis les paramètres,
          prévoit aussi l’effacement de ses évaluations locales sur cet appareil.
          Elle ne supprime pas les évaluations sans compte, les copies sur
          d’autres appareils, les PDF téléchargés ou les résumés déjà partagés.
          En cas d’échec du nettoyage local, effacez les données du site
          dans les réglages du navigateur.
        </p>
        <h3>Préférences, contact d’urgence et session</h3>
        <p>
          Les préférences, consentements, informations de profil, jetons de
          session et coordonnées du contact d’urgence ne sont pas protégés
          par le chiffrement de l’historique. Ils sont conservés séparément
          dans le navigateur. Le contact d’urgence peut être supprimé dans
          les paramètres. La déconnexion retire les informations locales
          de session, mais ne supprime pas à elle seule l’historique ou
          toutes les préférences.
        </p>

        <h3>Statistiques Google Analytics</h3>
        <p>
          Le tag Google Analytics est chargé après votre acceptation des
          statistiques. Il peut utiliser des cookies et des identifiants
          techniques pour mesurer la fréquentation. Le suivi manuel prévu
          dans le code porte sur l'accueil et la page des premiers gestes.
          Les réponses au questionnaire, les symptômes et le contenu des
          historiques ne sont pas des paramètres prévus par ce suivi manuel.
        </p>
        <p>
          Vous pouvez modifier ce choix dans les <Link to="/Setting">paramètres</Link>,
          rubrique « Confidentialité et consentements », avec le réglage
          « Statistiques Google Analytics ». Le refus empêche le chargement
          initial du tag. Après une acceptation, le retrait désactive les
          collectes suivantes via le module Analytics ; il n'efface pas
          automatiquement les données déjà transmises ni les cookies déjà déposés.
        </p>
        <p>
          Pour en savoir plus sur les pratiques de Google, consultez sa{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            politique de confidentialité
          </a>.
        </p>

        <h3>Retrait du consentement aux données de santé</h3>
        <p>
          Dans les paramètres, un bouton permet de retirer votre consentement
          aux données de santé. Cette action supprime la trace locale de votre
          accord et empêche la poursuite des fonctionnalités qui le nécessitent
          sans nouvel accord. Elle ne supprime pas automatiquement les évaluations
          enregistrées. Pour les effacer, utilisez les fonctions de suppression
          après déverrouillage ou effacez les données du site dans le navigateur.
          Pour demander l'effacement des données du compte ou
          exercer vos droits, utilisez le contact indiqué dans la section 9.
        </p>
        <p>
          Un fichier PDF téléchargé ou un résumé partagé constitue une copie
          distincte : sa suppression n'est pas effectuée par la suppression
          d'un épisode dans l'application.
        </p>

        <h2>8. Droits des utilisateurs</h2>
        <p>
          Conformément au RGPD, les utilisateurs disposent,
          selon les conditions applicables, des droits suivants :
        </p>
        <ul>
          <li>Droit d'accès à leurs données personnelles.</li>
          <li>Droit de rectification des données inexactes.</li>
          <li>Droit à l'effacement des données.</li>
          <li>Droit à la limitation du traitement.</li>
          <li>Droit d'opposition, lorsque ce droit s'applique.</li>
          <li>Droit à la portabilité, lorsque ce droit s'applique.</li>
          <li>
            Droit de retirer leur consentement lorsque
            le traitement repose sur celui-ci.
          </li>
        </ul>
        <p>
          Les utilisateurs peuvent également définir
          des directives relatives au sort de leurs
          données personnelles après leur décès.
        </p>

        <h2>9. Exercice des droits</h2>
        <p>
          L’éditrice ne dispose pas d’un accès à votre historique local ni
          des secrets permettant de le déchiffrer. Pour une demande relative
          à l’historique, n’envoyez pas votre mot de passe ou votre code de
          récupération par e-mail. Les données de compte peuvent être modifiées
          ou supprimées depuis les paramètres.
        </p>
        <p>
          Pour exercer leurs droits, les utilisateurs
          peuvent envoyer une demande à :
          {" "}
          <a href="mailto:giovanieandrianirina@gmail.com">
            giovanieandrianirina@gmail.com
          </a>.
        </p>
        <p>
          Une réponse est apportée en principe dans
          un délai d'un mois à compter de la réception
          de la demande, sous réserve des prolongations
          autorisées par le RGPD.
        </p>
        <p>
          Un justificatif d'identité peut être demandé
          uniquement en cas de doute raisonnable
          sur l'identité du demandeur.
        </p>

        <h2>10. Réclamation auprès de la CNIL</h2>
        <p>
          Si un utilisateur estime que ses droits ne
          sont pas respectés, il peut déposer une
          réclamation auprès de la Commission nationale
          de l'informatique et des libertés (CNIL).
        </p>
        <p>
          CNIL — 3 place de Fontenoy, 75007 Paris.
        </p>
        <p>
          Site internet :
          {" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            www.cnil.fr
          </a>
        </p>

        <h2>11. Modification de la politique</h2>
        <p>
          La présente politique de confidentialité
          peut être modifiée pour tenir compte
          des évolutions de BADDIES ou de
          la réglementation applicable.
        </p>
        <p>
          La version en vigueur est celle publiée
          sur le site à la date de consultation.
        </p>
        <Link to="/Setting" className="btn">Fermer</Link>
      </main>
    </>
  );
}
