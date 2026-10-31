# Vérification de la livraison

## Résultats automatisés — PASS
- 8 pages HTML ; au moins 8 sections par page : accueil 12, chambres 10, réservation 14 (dont les étapes du parcours), gastronomie 12, spa 11, expériences 11, galerie 9, contact 11.
- Chemins locaux, ancres, identifiants uniques, textes alternatifs présents, imports JavaScript et données JSON : contrôle réussi.
- Syntaxe de tous les modules JavaScript : contrôle Node réussi.
- 10 fichiers WebP locaux présents ; planche contact inspectée pour cohérence visuelle.
- 6 scénarios de tests métier réussis : dates et durées invalides ; capacités et adultes/chambres ; chevauchements et nuits adjacentes ; occupation par nuit pour séjours disjoints ; prix, week-end, remise, options et taxe ; informations client et code promotionnel.

Commandes de reproduction depuis la racine :

```sh
node --test tests/booking.test.js
python3 tests/check_files.py
```

## Non vérifié dans un navigateur
Le navigateur de recette de l’environnement n’a pas pu démarrer. Aucun résultat de rendu desktop/mobile, de test de saisie réelle, de parcours interactif complet ou de performance Lighthouse n’est revendiqué.

Recette recommandée après démarrage :
1. Ouvrir les 8 pages aux largeurs 375, 768 et 1440 px ; vérifier l’absence de débordement horizontal.
2. Ouvrir et fermer le menu mobile, parcourir au clavier, vérifier les focus.
3. Dans la galerie : filtrer, agrandir, utiliser les flèches et Échap, tester le balayage tactile.
4. Réserver un séjour futur fictif avec ELYSEE10, petit déjeuner et transfert ; vérifier le total avant et après sauvegarde.
5. Retrouver la référence sur le même navigateur, supprimer la simulation, refaire une recherche.
6. Tester plusieurs réservations sur une catégorie de stock limité et des dates qui se chevauchent.
7. Soumettre les formulaires avec des données fictives ; vérifier le message explicite d’absence d’envoi.
8. Activer la réduction des animations et vérifier que tout le contenu reste accessible.

Ce projet n’est pas un moteur hôtelier de production. Voir les limites détaillées dans README.md et ARCHITECTURE_PRODUCTION.md.
