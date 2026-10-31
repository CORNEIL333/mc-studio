# MAISON ÉLYSÉE
## Site hôtelier de démonstration — livraison complète

### Démarrer en 2 minutes
1. Extraire **tout le ZIP**, et non un seul fichier HTML.
2. Sur Windows, double-cliquer sur **DEMARRER_WINDOWS.bat** (Python 3 nécessaire).
3. Ouvrir **http://localhost:8080** dans votre navigateur.

Autres systèmes, depuis ce dossier :

```sh
python3 -m http.server 8080
```

Puis ouvrir http://localhost:8080. Avec VS Code, « Live Server » convient également.
Ne pas ouvrir les pages directement en `file://` : les modules JavaScript nécessitent un serveur HTTP.
Aucune dépendance npm à installer. Node.js est seulement utile pour les tests : `npm test`.

### Contenu
- 8 pages : accueil, chambres, réservation, gastronomie, spa, expériences, galerie, contact.
- 10 photographies originales générées par IA, stockées localement au format WebP.
- HTML sémantique, CSS adaptatif et JavaScript natif en modules, sans framework ni CDN.
- Galerie filtrable, visionneuse modale, flèches clavier, Échap et navigation tactile.
- Navigation mobile, focus visibles, libellés, annonces de statut, réduction des animations.
- Moteur de réservation local, tarifs, capacités, options, remise, inventaire, consultation et suppression.
- Formulaires de contact/table/spa/expériences : validation et retour explicite, sans envoi.

### Démonstration de réservation
Choisir une arrivée future, un départ et les voyageurs. Cliquer sur une catégorie disponible, puis personnaliser le séjour. Utiliser uniquement une identité fictive, par exemple : Alex Exemple / alex@example.com. Cocher l’accord de simulation, vérifier et enregistrer.

Code promotionnel : **ELYSEE10** (10 % sur le seul hébergement).
Le vendredi et le samedi : majoration de 15 % sur la nuit correspondante.
Petit déjeuner : 25 € / voyageur / nuit. Transfert : 120 € par séjour. Taxe fictive : 3 € / adulte / nuit.
Les enfants sont comptés dans la capacité et pour le petit déjeuner. Une seule catégorie par simulation ; au moins un adulte par chambre.
Maximum : 4 chambres, 60 nuits, 20 adultes et 20 enfants, sous réserve de capacité et de stock.
Une chambre libérée à une date peut être occupée par un autre séjour commençant ce même jour.

Le stock est calculé nuit par nuit dans ce navigateur. La finalisation refait un contrôle local de disponibilité. Les simulations restent dans localStorage ; elles ne sont pas partagées entre appareils et ne sont pas sûres contre des écritures concurrentes entre onglets. Il n’existe aucune réservation réelle, aucun paiement et aucun e-mail envoyé.
Les informations d’identité saisies restent dans la mémoire de la page et ne sont pas enregistrées dans les réservations. Pour annuler une simulation, retrouver sa référence plus bas et cliquer sur « Supprimer cette simulation ». Un bouton permet aussi de tout effacer.
Si le stockage du navigateur est bloqué ou plein, l’enregistrement signale un échec et ne présente pas de référence enregistrée.

### Personnalisation
- Couleurs et polices : `assets/css/tokens.css`.
- Textes : fichiers HTML de chaque page.
- Inventaire utilisé par le moteur : `assets/js/rooms.js`.
- Copie éditable des données : `data/rooms.json` (à synchroniser avec rooms.js après modification).
- Prix et options : `assets/js/pricing.js`.
- Règles et validation : `assets/js/validation.js`, `availability.js`.
- Images : `assets/images/` ; ne pas renommer sans modifier leurs références HTML.
- Sources et prompts : `IMAGE_SOURCES.md`.

### Hébergement
Copier le contenu du dossier sur un hébergement statique servant les fichiers JS avec un type MIME JavaScript. `index.html` est la page d’entrée. Aucun processus serveur applicatif, aucune clé ni compilation ne sont nécessaires. Le site est livré sous forme de fichiers, sans déploiement externe.
La démonstration porte `noindex,nofollow` pour ne pas référencer un hôtel fictif. Avant un lancement réel : enlever cette directive après remplacement des contenus fictifs, ajouter le domaine canonique, des URL Open Graph absolues et des métadonnées réelles. Aucun balisage Hotel, fausse note ou faux avis structuré n’est publié.

### Qualité et limites
Les tests automatisés métier et le contrôle des liens sont consignés dans `VERIFICATION.md`.
La vérification visuelle interactive sur navigateur n’a pas pu être exécutée dans l’environnement de livraison. Une recette sur appareils réels reste nécessaire, notamment clavier, mobile, contraste, lecteur d’écran et parcours complet. Aucune certification WCAG ni score Lighthouse n’est revendiqué.
Pour passer en production, suivre `ARCHITECTURE_PRODUCTION.md`.
