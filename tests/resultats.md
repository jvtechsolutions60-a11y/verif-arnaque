# Résultats des tests

Règles version 2026-10. 23 messages sur 23 ont le verdict attendu.

Relancer : `node tests/lancer-tests.js` depuis le dossier du projet. Les messages sont dans `tests/messages.json` (A = arnaque, L = légitime).

| N° | Message | Attendu | Obtenu | Points | Signaux repérés | Conforme |
|---|---|---|---|---|---|---|
| A01 | Faux colis Chronopost avec frais | Élevé | Élevé | 10 | paiement, domaine_suspect, urgence, organisme | oui |
| A02 | Faux Ameli carte Vitale | Élevé | Élevé | 10 | paiement, domaine_suspect, urgence, organisme | oui |
| A03 | Faux remboursement impôts | Élevé | Élevé | 12 | paiement, domaine_suspect, urgence, organisme, http_ip | oui |
| A04 | Faux conseiller bancaire (code) | Élevé | Élevé | 9 | code, conseiller, organisme | oui |
| A05 | Faux CPF | Élevé | Élevé | 6 | urgence, organisme, raccourci | oui |
| A06 | Fausse amende ANTAI | Élevé | Élevé | 10 | paiement, domaine_suspect, urgence, organisme | oui |
| A07 | Faux mail Netflix | Élevé | Élevé | 11 | paiement, domaine_suspect, urgence, organisme, formulation | oui |
| A08 | Faux gain | Élevé | Élevé | 10 | paiement, organisme, gain, http_ip, formulation | oui |
| A09 | Faux policier (convocation) | Élevé | Élevé | 7 | conseiller, urgence, piece_jointe | oui |
| A10 | Faux mail PayPal (mot de passe) | Élevé | Élevé | 14 | code, conseiller, domaine_suspect, urgence, organisme | oui |
| A11 | Faux QR code | Moyen | Moyen | 4 | organisme, piece_jointe | oui |
| A12 | Faux Crédit Agricole | Élevé | Élevé | 7 | domaine_suspect, urgence, organisme | oui |
| A13 | Lien seul douteux | Moyen | Moyen | 5 | domaine_suspect, organisme | oui |
| L01 | Rendez-vous médical | Faible | Faible | 0 | aucun | oui |
| L02 | Code de connexion (OTP) | Faible | Faible | 0 | aucun | oui |
| L03 | Message familial | Faible | Faible | 0 | aucun | oui |
| L04 | Livraison La Poste normale | Faible | Faible | 2 | organisme | oui |
| L05 | Lien officiel seul | Faible | Faible | 2 | organisme | oui |
| L06 | Rappel de sécurité bancaire | Faible | Faible | 2 | organisme | oui |
| L07 | Mail professionnel | Faible | Faible | 0 | aucun | oui |
| L08 | Confirmation de commande | Faible | Faible | 2 | urgence | oui |
| L09 | Facture prélevée, rien à payer | Faible | Faible | 0 | aucun | oui |
| L10 | Newsletter avec lien officiel | Faible | Faible | 2 | organisme | oui |
