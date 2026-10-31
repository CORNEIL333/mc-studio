# FLORÉA — Maison de beauté

Site HTML de démonstration à **9 pages**, avec la direction florale et cinématographique de la maquette initiale.

## Démarrage
Extraire le ZIP en entier, conserver le dossier `assets` et les fichiers HTML ensemble.
Ouvrir `index.html` pour parcourir le site. Aucune installation ou compilation n’est nécessaire pour afficher les pages.

Pour que les simulations soient partagées de manière fiable entre la page de réservation et la page Espace VIP, servir tout le dossier sous une même origine HTTP :
- Windows : double-cliquer `DEMARRER_WINDOWS.bat` (Python 3 nécessaire), puis ouvrir http://localhost:8080.
- Autres systèmes : `python3 -m http.server 8080` depuis ce dossier.
- Alternative : ouvrir `index.html` avec Live Server dans VS Code.

L’ouverture directe en `file://` permet la navigation, mais le stockage local peut être isolé par page ou bloqué selon le navigateur. Aucun partage fiable de réservations entre les pages n’est garanti dans ce mode.

## Les neuf pages
1. `index.html` — accueil cinématographique, manifeste, trois univers et aperçus.
2. `spa.html` — spa botanique, soins, carte des prestations, préparation et FAQ.
3. `coiffure.html` — atelier coiffure, boucles, coupe et prestations.
4. `onglerie.html` — manucure, création florale et tarifs.
5. `maison.html` — philosophie, décor et hospitalité.
6. `galerie.html` — galerie filtrable et visionneuse avec clavier et balayage tactile.
7. `rendez-vous.html` — véritable page de prise de rendez-vous et de réservation de soins, formulaire visible dans la page.
8. `espace-vip.html` — consultation et suppression des simulations, préférences et exemple de fidélité.
9. `contact.html` — informations fictives et formulaire de contact sans envoi.

Les liens « Réserver » et les boutons des prestations ouvrent la page dédiée. Une prestation choisie depuis sa page est présélectionnée dans le parcours.

## Parcours de réservation
Choisir un univers, une prestation, un spécialiste fictif, une date et un créneau. Continuer, saisir une identité fictive, accepter le caractère démonstratif et enregistrer la simulation. Une référence locale est affichée. La page Espace VIP permet de la retrouver et de la supprimer dans le même navigateur, sous la même origine HTTP.

Le moteur vérifie les dates, les heures entre 9 h et 18 h, la durée des prestations et les chevauchements du même spécialiste. Le dimanche est fermé. Le prix et la durée sont rappelés avant validation. Changer de soin, de spécialiste ou de date remet le créneau à zéro.

Aucun paiement ni message n’est envoyé. Les noms et e-mails saisis ne sont pas enregistrés. FLORÉA, les prix, les spécialistes et les horaires sont fictifs. Les données restent dans le navigateur ; aucun planning partagé entre utilisateurs, authentification ou base serveur n’existent. Le compteur de fidélité est un exemple fixe, indépendant des simulations. Un backend transactionnel et des confirmations réelles seront nécessaires pour une exploitation commerciale.

## Design et mouvements
Palette vert forêt, corail, ivoire et bordeaux. Typographie éditoriale, photos grand format, révélations progressives, scène florale épinglée, zoom lié au défilement, menu plein écran, transitions d’apparition entre les pages et galerie tactile. Le défilement est natif et n’est pas détourné.
La préférence système de réduction des animations est respectée. Un bouton dans le pied de page permet aussi de réduire les mouvements.

## Modifier le site
- Contenus : fichiers HTML.
- Styles communs : `assets/css/site.css`.
- Navigation, réservation, galerie et VIP : `assets/js/app.js`.
- Catalogue et profils : constantes `SERVICES` et `SPECIALISTS` au début de ce script.
- Images locales : `assets/images/`.
- Sources : `IMAGE_SOURCES.md` ; prompts : `IMAGE_PROMPTS.json`.

Les images et les polices ne demandent aucun accès réseau externe. Le site est statique et peut être copié sur un hébergement HTTP/HTTPS en conservant les chemins.

## Vérification
- 9 pages, exactement un titre H1 par page.
- Liens, ancres, fichiers, identifiants, catégories et présence du formulaire de réservation dans sa page : PASS.
- Syntaxe du script partagé : PASS.
- 8 tests métier : PASS (catalogue, dates, durées, fermeture dimanche, conflits, rendez-vous adjacents, stockage et données locales).

Commandes : `python3 check_pages.py` et `node --test tests.mjs`.

Le rendu visuel et les interactions dans un navigateur réel n’ont pas été vérifiés dans l’environnement de livraison. Aucune mesure Lighthouse ou conformité d’accessibilité certifiée n’est revendiquée. Recetter les pages sur mobile et ordinateur, le clavier, les filtres, la saisie, le parcours complet et la consultation depuis Espace VIP avant présentation commerciale.
