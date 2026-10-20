/*
 * Détecteur d'arnaques en ligne — fichier de règles
 * ---------------------------------------------------------------
 * Ce fichier regroupe tout ce qui peut changer avec les arnaques du
 * moment : les signaux, leurs points, les mots surveillés, les
 * organismes et leurs sites officiels. On peut le modifier sans
 * toucher à la page (index.html).
 *
 * Comment écrire les mots :
 *  - en minuscules et SANS accents (« bloque » trouve aussi « bloqué ») ;
 *  - un mot ou une expression est trouvé comme mot entier ;
 *  - « motifs » accepte des expressions régulières pour les cas
 *    plus fins (réservé aux personnes à l'aise avec ce format).
 *
 * negation: true  => une occurrence précédée de « ne », « n' » ou
 * « jamais » dans le même bout de phrase est ignorée
 * (ex. « nous ne vous demanderons jamais votre mot de passe »).
 *
 * Dernière relecture : octobre 2026. À relire chaque trimestre.
 */
var REGLES = {
  version: "2026-10",

  // 0 à 2 = faible, 3 à 5 = moyen, 6 et plus = élevé
  seuils: { moyen: 3, eleve: 6 },

  // Si l'un de ces signaux est repéré, le verdict ne peut pas être « faible »
  signauxBloquants: ["code", "paiement"],

  signaux: [
    {
      id: "urgence",
      points: 2,
      raison: "Le message crée une fausse urgence ou une menace pour vous presser.",
      mots: [
        "urgent", "urgente", "urgence", "dernier avis", "dernier rappel", "derniere relance",
        "dernier delai", "immediatement", "sans delai", "au plus vite", "des que possible",
        "compte bloque", "compte suspendu", "compte desactive", "acces bloque",
        "sera bloque", "sera suspendu", "sera supprime", "sera desactive", "sera cloture",
        "seront bloques", "seront supprimes", "seront perdus", "sera perdu", "sera annule",
        "sera retourne", "renvoye a l'expediteur", "retourne a l'expediteur",
        "faute de", "a defaut de", "sous peine", "poursuites", "majoration", "penalite",
        "penalites", "expire aujourd'hui", "expire bientot", "derniere chance",
        "action requise", "intervention requise"
      ],
      motifs: [
        "(sous|dans les|avant) \\d{1,2} ?(h|heures?|jours?)\\b",
        "\\b(24|48|72) ?h\\b",
        "\\b(compte|carte|acces|abonnement|ligne) (est|a ete|va etre) (bloque|suspendu|desactive|resilie)e?s?\\b"
      ]
    },
    {
      id: "organisme",
      points: 2,
      raison: "Le message se présente comme venant d'un organisme connu, souvent imité par les escrocs.",
      mots: [
        "ameli", "assurance maladie", "carte vitale", "impots", "impot", "dgfip", "tresor public",
        "caf", "allocations familiales", "chronopost", "la poste", "laposte", "colissimo",
        "mondial relay", "dhl", "ups", "fedex", "dpd", "gls", "antai", "amende", "ants",
        "france travail", "pole emploi", "cpf", "mon compte formation", "urssaf", "crit'air",
        "banque", "credit agricole", "bnp", "bnp paribas", "societe generale", "lcl",
        "caisse d'epargne", "banque populaire", "credit mutuel", "cic", "la banque postale",
        "boursorama", "boursobank", "paypal", "netflix", "amazon", "vinted", "leboncoin",
        "orange", "sfr", "bouygues", "free mobile", "edf", "engie", "apple", "icloud", "microsoft"
      ]
    },
    {
      id: "paiement",
      points: 3,
      negation: true,
      raison: "Le message vous demande de payer des frais, de régler une somme ou de recevoir un remboursement.",
      mots: [
        "payer", "payez", "regler", "reglez", "reglement", "s'acquitter", "acquittez",
        "frais de livraison", "frais de port", "frais de douane", "frais de reexpedition",
        "frais de traitement", "frais de dossier", "frais supplementaires", "droits de douane",
        "remboursement", "rembourser", "remboursee", "rembourse", "trop percu",
        "virement", "carte cadeau", "coupon pcs", "transcash", "neosurf", "paysafecard",
        "coordonnees bancaires", "informations de paiement", "moyen de paiement",
        "mettre a jour votre paiement"
      ]
    },
    {
      id: "code",
      points: 4,
      negation: true,
      raison: "Le message demande un code, un mot de passe ou des informations de carte bancaire. Un organisme sérieux ne le demande jamais.",
      mots: [
        "mot de passe", "numero de carte", "cryptogramme", "cvv", "code confidentiel",
        "code pin", "date d'expiration", "date d'expiration de votre carte",
        "identifiants bancaires", "vos identifiants"
      ],
      motifs: [
        "(communiqu|transmet|indiqu|envoy|donn|confirm|saisi|renseign|entr|fourni|repond|verifi|valid|dict|lis)[a-z]*[^.!?\\n]{0,40}\\b(code|mot de passe|identifiants?|carte bancaire|numero de carte)\\b"
      ]
    },
    {
      id: "conseiller",
      points: 3,
      negation: true,
      raison: "Le message reprend le scénario du faux conseiller bancaire ou du faux policier.",
      mots: [
        "compte a ete pirate", "compte pirate", "operation suspecte", "operations suspectes",
        "operation frauduleuse", "paiement suspect", "activite suspecte", "tentative de fraude",
        "service fraude", "service des fraudes", "conseiller fraude", "conseiller bancaire",
        "mettre votre argent en securite", "compte securise", "compte de securite",
        "virement de securite", "ne raccrochez pas", "convocation", "gendarmerie",
        "police nationale", "brigade", "europol", "interpol", "mandat d'arret",
        "pedopornographie", "plainte deposee contre vous"
      ]
    },
    {
      id: "faux_proche",
      points: 3,
      raison: "Le message reprend le scénario du « faux proche » : un enfant ou un ami qui aurait changé de numéro et demande de l'aide.",
      conseil: "Appelez votre proche sur son numéro habituel avant de répondre ou d'envoyer de l'argent.",
      mots: [
        "nouveau numero", "change de numero", "changer de numero", "mon ancien numero",
        "casse mon telephone", "perdu mon telephone", "mon telephone est casse",
        "mon telephone est tombe", "telephone en reparation", "enregistre ce numero",
        "enregistre mon nouveau", "enregistre celui-ci", "ecris-moi sur whatsapp",
        "ecris moi sur whatsapp", "contacte-moi sur whatsapp", "c'est moi maman",
        "c'est moi papa", "maman c'est moi", "papa c'est moi"
      ]
    },
    {
      id: "numero_surtaxe",
      points: 3,
      raison: "Le message vous demande d'appeler un numéro surtaxé (commençant par 089), très coûteux.",
      conseil: "N'appelez pas ce numéro : il peut vous coûter plusieurs euros par minute.",
      motifs: ["(^|[^0-9])(\\+33\\s?|0)8[\\s.]?9([\\s.]?\\d){7}($|[^0-9])"]
    },
    {
      id: "argent_facile",
      points: 3,
      raison: "Le message promet de l'argent facile : faux emploi, faux placement ou cryptomonnaie.",
      conseil: "Méfiez-vous de tout gain rapide promis par un inconnu : aucun placement sérieux n'est garanti.",
      mots: [
        "travail a domicile", "teletravail remunere", "sans experience", "revenus complementaires",
        "quelques minutes par jour", "quelques minutes de votre temps", "liker des videos",
        "investissez", "cryptomonnaie", "crypto-monnaie", "bitcoin", "trading",
        "rendement garanti", "placement garanti", "gains garantis", "sans risque", "doublez votre"
      ],
      motifs: ["\\d+ ?(€|euros?) ?(par|/) ?(jour|heure|h)\\b"]
    },
    {
      id: "gain",
      points: 2,
      raison: "Le message annonce un gain, un cadeau ou un colis inattendu.",
      mots: [
        "vous avez gagne", "vous etes le gagnant", "gagnant", "felicitations", "tirage au sort",
        "cadeau", "offert", "offerte", "gratuit", "gratuitement", "recompense", "bon d'achat",
        "colis en attente", "colis en instance", "colis bloque", "un colis vous attend",
        "heritage", "vous avez ete selectionne"
      ]
    },
    {
      id: "piece_jointe",
      points: 2,
      raison: "Le message pousse à ouvrir une pièce jointe ou à scanner un QR code.",
      mots: [
        "qr code", "code qr", "lien du qr code", "scannez", "flashez", "ouvrez la piece jointe",
        "voir la piece jointe", "telechargez la facture", "telechargez le document"
      ],
      motifs: [
        "\\b[\\w-]+\\.(zip|rar|7z|exe|scr|iso|js|vbs|htm|html)\\b"
      ]
    },
    {
      id: "formulation",
      points: 1,
      raison: "La formulation est inhabituelle : tournures maladroites, formule impersonnelle ou majuscules en excès.",
      mots: [
        "cher client", "chere cliente", "cher(e) client(e)", "cher utilisateur",
        "cher beneficiaire", "cher titulaire", "veuiller", "nous avons essayer",
        "votre colis ne peut pas etre livre", "cliquez ici", "cliquez sur le lien",
        "veuillez cliquer"
      ],
      motifs: ["!{2,}"]
      // + contrôle automatique des majuscules (voir "majuscules" plus bas)
    }
  ],

  // Signaux calculés à partir des liens (raisons et points)
  liens: {
    raccourci: {
      points: 2,
      raison: "Le message contient un lien raccourci, qui cache sa vraie destination."
    },
    domaine_suspect: {
      points: 3,
      raison: "Le lien mène à une adresse douteuse qui imite un vrai site ou en a l'apparence bricolée."
    },
    http_ip: {
      points: 2,
      raison: "Le lien n'est pas sécurisé (pas de https) ou est une adresse chiffrée."
    }
  },

  majuscules: { minLettres: 20, ratio: 0.35 },

  raccourcisseurs: [
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "v.gd", "cutt.ly",
    "rebrand.ly", "shorturl.at", "tiny.cc", "s.id", "rb.gy", "urlz.fr", "lc.cx",
    "t.ly", "buff.ly", "short.io", "bl.ink", "qrco.de", "shorturl.gg", "u.to", "x.gd"
  ],

  extensionsDouteuses: [
    "xyz", "top", "click", "live", "icu", "online", "site", "shop", "buzz", "support",
    "help", "info", "cfd", "sbs", "rest", "monster", "cyou", "work", "loan", "win", "vip"
  ],

  // Extensions acceptées pour repérer un lien écrit sans http(s)
  extensionsConnues: [
    "fr", "com", "net", "org", "eu", "be", "ch", "io", "co", "me", "ly", "gl", "gd",
    "app", "link", "id", "to", "cc", "at", "de", "uk", "us"
  ],

  // Marques et organismes : mots à chercher dans une adresse web, et
  // sites officiels. Une adresse qui contient la marque sans être un
  // site officiel est jugée douteuse.
  organismes: [
    { nom: "Ameli", cles: ["ameli", "assurancemaladie"], officiels: ["ameli.fr"] },
    { nom: "les impôts", cles: ["impots", "impot", "dgfip"], officiels: ["impots.gouv.fr"] },
    { nom: "la CAF", cles: ["caf"], officiels: ["caf.fr"] },
    { nom: "La Poste", cles: ["laposte", "colissimo"], officiels: ["laposte.fr", "laposte.net", "colissimo.fr", "labanquepostale.fr"] },
    { nom: "Chronopost", cles: ["chronopost"], officiels: ["chronopost.fr"] },
    { nom: "Mondial Relay", cles: ["mondialrelay"], officiels: ["mondialrelay.fr", "mondialrelay.com"] },
    { nom: "DHL", cles: ["dhl"], officiels: ["dhl.com", "dhl.fr"] },
    { nom: "UPS", cles: ["ups"], officiels: ["ups.com"] },
    { nom: "FedEx", cles: ["fedex"], officiels: ["fedex.com"] },
    { nom: "l'ANTAI", cles: ["antai", "amende", "amendes"], officiels: ["antai.gouv.fr", "amendes.gouv.fr"] },
    { nom: "l'ANTS", cles: ["ants"], officiels: ["ants.gouv.fr"] },
    { nom: "Mon Compte Formation", cles: ["moncompteformation", "cpf"], officiels: ["moncompteformation.gouv.fr"] },
    { nom: "France Travail", cles: ["francetravail", "poleemploi"], officiels: ["francetravail.fr"] },
    { nom: "l'administration", cles: ["gouv"], officiels: ["gouv.fr"] },
    { nom: "PayPal", cles: ["paypal"], officiels: ["paypal.com", "paypal.fr"] },
    { nom: "Netflix", cles: ["netflix"], officiels: ["netflix.com"] },
    { nom: "Amazon", cles: ["amazon"], officiels: ["amazon.fr", "amazon.com"] },
    { nom: "Vinted", cles: ["vinted"], officiels: ["vinted.fr", "vinted.com"] },
    { nom: "Leboncoin", cles: ["leboncoin"], officiels: ["leboncoin.fr"] },
    { nom: "Orange", cles: ["orange"], officiels: ["orange.fr", "orange.com"] },
    { nom: "SFR", cles: ["sfr"], officiels: ["sfr.fr"] },
    { nom: "Bouygues Telecom", cles: ["bouygues", "bouyguestelecom"], officiels: ["bouyguestelecom.fr"] },
    { nom: "EDF", cles: ["edf"], officiels: ["edf.fr"] },
    { nom: "Engie", cles: ["engie"], officiels: ["engie.fr"] },
    { nom: "le Crédit Agricole", cles: ["creditagricole"], officiels: ["credit-agricole.fr"] },
    { nom: "BNP Paribas", cles: ["bnp", "bnpparibas"], officiels: ["bnpparibas", "bnpparibas.net", "bnpparibas.com", "bnpparibas.fr"] },
    { nom: "la Société Générale", cles: ["societegenerale"], officiels: ["societegenerale.fr", "societegenerale.com"] },
    { nom: "LCL", cles: ["lcl"], officiels: ["lcl.fr"] },
    { nom: "la Caisse d'Épargne", cles: ["caisseepargne", "caissedepargne"], officiels: ["caisse-epargne.fr"] },
    { nom: "la Banque Populaire", cles: ["banquepopulaire"], officiels: ["banquepopulaire.fr"] },
    { nom: "le Crédit Mutuel", cles: ["creditmutuel"], officiels: ["creditmutuel.fr"] },
    { nom: "Boursorama", cles: ["boursorama", "boursobank"], officiels: ["boursorama.com", "boursobank.com"] },
    { nom: "Apple", cles: ["apple", "icloud"], officiels: ["apple.com", "icloud.com"] },
    { nom: "Microsoft", cles: ["microsoft", "office365", "outlook"], officiels: ["microsoft.com", "live.com", "outlook.com", "office.com"] }
  ]
};

if (typeof module !== "undefined") { module.exports = REGLES; }
