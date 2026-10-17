# Vérif'Arnaque

Page web gratuite de JVTECH Solutions : on colle un SMS, un mail ou un lien suspect et on obtient un verdict (risque faible, moyen ou élevé), les raisons repérées et les gestes à faire. Tout se passe dans le navigateur : rien n'est envoyé ni enregistré, aucun cookie, aucun outil de mesure.

## Fichiers

- `index.html` : la page complète (textes, style, moteur d'analyse). S'ouvre directement dans un navigateur, sans serveur.
- `regles.js` : les signaux, leurs points, les mots surveillés, les organismes et leurs sites officiels. C'est le seul fichier à modifier pour suivre les arnaques du moment.
- `logo/` : logo Vérif'Arnaque (fond clair, fond sombre, icône d'onglet). Bleu de marque : #1B4F8C.
- `tests/` : 23 messages de test (13 arnaques, 10 légitimes) avec le verdict attendu, et le script qui les vérifie.

## Barème

Chaque signal repéré ajoute des points : 0 à 2 = faible, 3 à 5 = moyen, 6 et plus = élevé. Un message qui demande un code, un mot de passe ou un paiement ne peut jamais être « faible ».

## Modifier les règles

1. Ouvrir `regles.js` et ajouter ou retirer des mots (en minuscules, sans accents).
2. Lancer les tests : `node tests/lancer-tests.js` (Node.js requis). Le résultat est écrit dans `tests/resultats.md`.
3. Si un nouveau type d'arnaque apparaît, ajouter un exemple dans `tests/messages.json`.

Relecture des règles conseillée chaque trimestre.

## Mise en ligne (O2switch)

Déposer `index.html`, `regles.js` et le dossier `logo/` à la racine du sous-domaine (par exemple verif.jvtechsolutions.fr), puis activer le certificat SSL. Le dossier `tests/` n'a pas besoin d'être mis en ligne.
