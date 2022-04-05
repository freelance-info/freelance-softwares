# Facturation pour Micro-Entreprise

Logiciel de facturation minimal pour être **conforme à la réglementation française** des micro-entreprises.
Idéal pour les développeur freelance qui souhaitent une base simple (**React.js**) à customiser.

# Quick start

Télécharger et exécuter l'installeur : ...
Le logiciel est préchargé avec un exemple de facture et de client, à supprimer bien sûr.

# Documentation utilisateur

## Les _Factures émises et reçues_ 

Le modèle contient toutes les mentions légales minimales:
- La date de la facture
- Le numéro de la facture
- La date de la vente ou de la prestation de service
- La dénomination sociale (ou nom et prénom pour un entrepreneur individuel),
- L'adresse du siège social et l'adresse de facturation (si différente),
- Le numéro de Siren ou Siret, le code NAF, la forme juridique et le capital social (pour les sociétés), le numéro RCS et ville du greffe d'immatriculation (pour les commerçants), le numéro au répertoire des métiers et département d'immatriculation (pour les artisans).
- L'identité de l'acheteur ou du client
- Le numéro du bon de commande uniquement s'il a été préalablement émis par l'acheteur.
- Le numéro d'identification à la TVA
- La nature, marque, et référence des produits doivent être mentionnés ainsi que les matériaux fournis et la main d'oeuvre pour les prestations.
- Le prix catalogue
- Le taux de TVA légalement applicable
- L'éventuelle réduction de prix
- La somme totale à payer hors taxe (HT) et toutes taxes comprises (TTC)
- L'adresse de facturation mais uniquement si elle est différente de celle du siège social de l'entreprise.
- La date à laquelle le paiement doit intervenir ou le délai de paiement
- Les conditions d'escompte en cas de paiement anticipé
- Les taux de pénalités en cas de non paiement ou de retard de paiement (40 €).
- L'existence et la durée de la garantie légale de conformité de deux ans pour certains biens

Le formulaire propose une aide à la saisie pour la plupart des champs.
L'export se fait sous forme d'un template .pdf.
Vous pouvez également joindre le scan d'une facture ou d'un ticket de caisse.



## Sauvegarde des données

Les données sont stockées sous forme de fichiers CSV, afin que vous puissiez les exploiter facilement avec un autre logiciel.
Vous pouvez aussi les sauvegarder très facilement sur le support de votre choix (dropbox, clé usb, etc.).
Selon votre volume d'activité, c'est vous qui choisissez comment découper vos fichiers : 1 fichier par mois, 1 fichier par année, etc.


# Développement
```
npm run start
npm run electron
```

## Philosophie

Logiciel minimaliste mais méta-données et modèle de documents extensibles à volonté.

Logiciel standalone développé en Javascript (**reactjs** + **electron**), compatible Windows, Linux et Mac.

Ce qu'il a de plus que tous les autres ? Il est bien documenté, fonctionne sur la stack la plus populaire, comporte peu de code et complètement transparent. Il est donc facile de monter à bord et je vous encourage à le forker si vous souhaitez le personnaliser. 

N'hésitez pas soumettre toute demande d'évolution, bug ou contribution! 

Pensez à lui mettre une petite étoile si cette initiative vous plaît!



