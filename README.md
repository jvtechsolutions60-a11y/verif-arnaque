# Vérif'Arnaque

Page web gratuite de JVTECH Solutions : on colle un SMS, un mail ou un lien suspect et on obtient un verdict (risque faible, moyen ou élevé), les raisons repérées et les gestes à faire. Tout se passe dans le navigateur : rien n'est envoyé ni enregistré, aucun cookie, aucun outil de mesure.

Version actuelle : **1.2.0** (voir `CHANGELOG.md`).

## Fichiers

- `index.html` : la page complète (textes, style, moteur d'analyse). S'ouvre directement dans un navigateur, sans serveur.
- `regles.js` : les signaux, leurs points, les mots surveillés, les organismes et leurs sites officiels. C'est le seul fichier à modifier pour suivre les arnaques du moment.
- `lecture-image.js` : lit le texte d'une capture d'écran (bouton, coller ou glisser-déposer), sur l'appareil. Le moteur n'est chargé qu'au premier ajout d'image.
- `vendor/tesseract/` : moteur de lecture de texte Tesseract.js 5.1.1 et données françaises (licence Apache 2.0), hébergés avec la page pour qu'aucune image ne parte ailleurs.
- `logo/` : logo Vérif'Arnaque (fond clair, fond sombre, icône d'onglet). Bleu de marque : #1B4F8C.
- `tests/` : 29 messages de test (18 arnaques, 11 légitimes) avec le verdict attendu, et le script qui les vérifie.

## Captures d'écran et liens d'images

On peut ajouter une capture d'écran d'un SMS ou d'un mail : le texte est lu dans le navigateur puis analysé comme un message collé. Un lien vers une image n'est jamais ouvert (cela pourrait prévenir l'escroc) : la page conseille d'en faire une capture d'écran.

## Barème

Chaque signal repéré ajoute des points : 0 à 2 = faible, 3 à 5 = moyen, 6 et plus = élevé. Un message qui demande un code, un mot de passe ou un paiement ne peut jamais être « faible ».

## Modifier les règles

1. Ouvrir `regles.js` et ajouter ou retirer des mots (en minuscules, sans accents).
2. Lancer les tests : `node tests/lancer-tests.js` (Node.js requis). Le résultat est écrit dans `tests/resultats.md`.
3. Si un nouveau type d'arnaque apparaît, ajouter un exemple dans `tests/messages.json`.

Relecture des règles conseillée chaque trimestre.

## Mise en ligne (O2switch)

Déposer `index.html`, `regles.js`, `lecture-image.js`, le fichier `.htaccess` et les dossiers `logo/` et `vendor/` à la racine du sous-domaine (par exemple verif.jvtechsolutions.fr), puis activer le certificat SSL. Le `.htaccess` force le https et interdit à la page tout envoi de données vers un autre site (politique de sécurité du navigateur). Attention : le gestionnaire de fichiers de cPanel masque parfois les fichiers commençant par un point. Le dossier `tests/` n'a pas besoin d'être mis en ligne.
