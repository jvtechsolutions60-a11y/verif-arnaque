# Historique des versions

## 1.3.0 (20/10/2026)
- QR codes : un QR code dans une capture d'écran est décodé sur l'appareil et son lien est vérifié, sans être ouvert.
- Parcours « Déjà cliqué, payé ou donné un code ? » : les gestes d'urgence selon la situation (carte, mot de passe, prise en main à distance, pièce d'identité).
- Bouton « Partager le résultat » pour prévenir un proche (le texte du message n'est pas partagé).
- Nouvelle page « Arnaques du moment » : 11 arnaques courantes, comment les reconnaître, le bon réflexe.
- Appli installable sur l'écran d'accueil, utilisable sans internet, qui reçoit un message ou une capture partagés depuis une autre appli (Android).
- Le style est maintenant dans style.css, commun aux pages.

## 1.2.0 (17/10/2026)
- Nouveau design : bandeau bleu de confiance, carte de saisie, jauge de risque à trois niveaux, gestes numérotés.
- Correction : la case d'aperçu d'image ne s'affiche plus quand aucune image n'est ajoutée.

## 1.1.0 (17/10/2026)
- Lecture des captures d'écran sur l'appareil (bouton, coller, glisser-déposer). Les liens d'images ne sont jamais ouverts.
- Nouveaux signaux : faux proche, numéros surtaxés 089, argent facile (faux emploi, crypto), avec un conseil adapté à chacun.
- Fichier .htaccess : https forcé et interdiction de tout envoi de données hors du site.
- 29 messages de test.

## 1.0.0 (17/10/2026)
- Première version : analyse d'un SMS, d'un mail ou d'un lien, verdict faible / moyen / élevé, raisons et gestes à faire.
- Nom et logo Vérif'Arnaque, règles dans regles.js, 23 messages de test.

La version des règles (regles.js) est indépendante : elle change à chaque relecture trimestrielle.
