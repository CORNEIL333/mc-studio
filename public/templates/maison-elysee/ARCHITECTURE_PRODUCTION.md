# Connecter un véritable hôtel

La livraison est une démonstration statique. localStorage est modifiable par l’utilisateur et ne représente aucune source fiable d’inventaire, de tarif ou de paiement.

## Direction artistique
Ivoire architectural #f4f1e9, encre #20231e, forêt #263e34, pierre #d5cfc2, brun #392b24 et accent champagne #9c835d. Photographies de pierre naturelle, de noyer et de lin, lumière douce. Grands titres en Georgia, interface en Arial/Helvetica : polices système, sans téléchargement ni ressource externe. Les compositions alternent plein écran, colonnes éditoriales, comparaison et surfaces sombres. Le mouvement repose sur transform et opacity, sans défilement détourné.

## Architecture cible
- Frontend statique conservé ; remplacer l’adaptateur de stockage et les recherches locales par des appels HTTPS.
- API serveur : disponibilité, devis horodaté, pré-réservation, confirmation, consultation et annulation.
- Base transactionnelle : inventaire par nuit, catégories, tarifs, clients, réservations, options, états, journal d’audit et clés d’idempotence.
- PMS/channel manager : source d’inventaire partagée avec les canaux de distribution. Définir explicitement le système maître.
- Paiement : page hébergée par un prestataire. Le navigateur ne traite jamais de coordonnées bancaires dans les formulaires du site.
- Services d’envoi : contact, table et spa utilisent leurs propres API et calendriers, distincts de l’inventaire des chambres.

## Flux de réservation
1. Le serveur valide les dates, la capacité et les règles tarifaires ; il recalcule tout prix envoyé par le navigateur.
2. Il retourne un devis signé/opaque avec expiration ; les montants sont stockés en unités monétaires entières.
3. Une transaction réserve temporairement les unités de stock avec expiration et contrôle de concurrence.
4. Le prestataire crée une session de paiement idempotente, liée au devis et à la pré-réservation.
5. Un webhook serveur signé et vérifié confirme le paiement et la réservation. Ne jamais confirmer sur la seule URL de retour du navigateur.
6. Les échecs et expirations libèrent le stock. Les événements répétitifs sont traités une seule fois.
7. Une référence et un accès individuel protégé permettent la consultation ; les références seules ne doivent pas exposer les données personnelles.

## Interfaces proposées — non implémentées
GET /api/availability?arrival=...&departure=...&adults=...&children=...&count=...
POST /api/quotes
POST /api/holds
POST /api/payment-sessions
POST /api/webhooks/payments
GET /api/reservations/{reference} (authentification requise)
POST /api/reservations/{reference}/cancel
POST /api/contact, /api/table-requests, /api/spa-requests, /api/experience-requests

## Préparation réelle
Remplacer les coordonnées, photos conceptuelles, prix, horaires, capacités et mentions fictives par des informations approuvées. Définir fiscalité, devise, annulation et remboursement. Ajouter sécurité serveur, journalisation sans données sensibles, sauvegardes et suivi des erreurs. Définir collecte et durée de conservation des données et exigences applicables au pays de l’hôtel. Valider les politiques avec le responsable de l’établissement. Recetter concurrence, paiements, annulations et restauration de sauvegarde avant ouverture commerciale.

Les visuels du concept ne peuvent pas représenter les installations d’un hôtel réel sans explication. Les témoignages fictifs devront être retirés ou remplacés par des avis authentiques autorisés.
