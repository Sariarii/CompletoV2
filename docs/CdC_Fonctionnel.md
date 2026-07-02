# Cahier des Charges Fonctionnel - Lab42c

## 1. Contexte

Lab42c est une entreprise spécialisée dans le développement de solutions techniques destinées aux entreprises du secteur des médias. Les infrastructures des clients sont entièrement déployées sur Amazon Web Services (AWS), puis exploitées et maintenues par Lab42c.

Les clients reçoivent une facturation mensuelle mais ne disposent d'aucune visibilité sur les coûts associés à leur infrastructure ou sur l'évolution de leur consommation. De son côté, Lab42c ne possède pas d'outil centralisé permettant de suivre efficacement les coûts AWS, d'anticiper les dépenses futures et d'évaluer la rentabilité de ses projets.

Le présent projet vise donc à développer un tableau de bord permettant d'améliorer le pilotage financier des infrastructures AWS tout en offrant une meilleure transparence aux clients.

---

# 2. Personae

Afin de répondre aux besoins des différents utilisateurs, deux profils principaux ont été identifiés.

## Persona 1 – Développeur Lab42c

**Nom :** Thomas Martin
**Fonction :** Développeur Cloud / DevOps chez Lab42c

### Profil

Thomas est chargé du développement et du maintien des infrastructures AWS des clients de Lab42c. Il suit régulièrement les coûts des architectures afin de contrôler les dépenses, d'anticiper les évolutions budgétaires et de préparer les facturations.

### Objectifs

- Consulter rapidement les coûts réels des infrastructures AWS ;
- Suivre les prévisions de dépenses des différents projets ;
- Estimer les revenus et les marges générées par chaque client ;
- Identifier les architectures dont les coûts évoluent anormalement ;
- Disposer d'une vue globale sur l'ensemble des clients de Lab42c.

### Besoins

- Accès à un tableau de bord complet et centralisé ;
- Données fiables et mises à jour régulièrement ;
- Visualisation synthétique des indicateurs financiers ;
- Accès sécurisé aux informations sensibles.

## Persona 2 – Client d'une entreprise de Média

**Nom :** Sophie Dubois
**Fonction :** Responsable des opérations numériques

### Profil

Sophie travaille au sein d'une entreprise du secteur des médias faisant appel à Lab42c pour l'hébergement et l'exploitation de ses services. Elle ne possède pas de connaissances techniques sur AWS mais souhaite comprendre l'évolution des coûts qui lui seront facturés.

### Objectifs

- Consulter les prévisions de ses prochaines factures ;
- Suivre l'évolution des coûts liés à son projet ;
- Disposer d'une vision simple et compréhensible de ses dépenses.

### Besoins

- Une interface claire et intuitive ;
- Un accès sécurisé à ses seules données ;
- Une consultation possible depuis un ordinateur, une tablette ou un smartphone ;
- Aucune information technique complexe ni accès aux coûts réels de l'infrastructure AWS.

---

# 3. Objectifs du projet

Le projet consiste à développer une application web permettant de suivre les coûts liés aux infrastructures AWS gérées par Lab42c.

Cette plateforme répond à un double objectif :

- fournir aux équipes internes de Lab42c un outil de pilotage des coûts, des revenus et des marges ;
- permettre aux clients de consulter une estimation de leurs futures factures sans divulguer les coûts réels des infrastructures AWS.

L'application devra distinguer clairement les fonctionnalités accessibles aux administrateurs de Lab42c et celles destinées aux clients.

---

# 4. Fonctionnalités attendues

## 4.1 Back-office Lab42c

Le back-office est réservé aux collaborateurs de Lab42c.

Il devra permettre de :

- visualiser l'ensemble des architectures AWS exploitées ;
- consulter les coûts réels des infrastructures AWS par client et par projet ;
- afficher les prévisions de coûts des architectures ;
- estimer les revenus issus de la facturation des clients ;
- calculer les marges et bénéfices prévisionnels ;
- disposer d'une vue consolidée de l'ensemble du portefeuille clients.

## 4.2 Espace Client

Chaque client dispose d'un accès sécurisé à son propre espace.

Les fonctionnalités comprennent :

- la consultation des prévisions de facturation ;
- le suivi de l'évolution des montants qui seront facturés ;
- la visualisation d'indicateurs synthétiques liés à son infrastructure.

Les clients ne doivent jamais avoir accès :

- aux coûts réels AWS ;
- aux marges réalisées par Lab42c ;
- aux données des autres clients.

---

# 5. Architecture technique

La solution prendra la forme d'une application web déployée sur l'infrastructure AWS de Lab42c.

L'architecture devra permettre :

- une séparation entre le frontend et le backend ;
- une authentification sécurisée des utilisateurs ;
- une gestion des rôles (Administrateur / Client) ;
- une base de données centralisant les informations de coûts et de facturation ;
- une architecture évolutive facilitant l'ajout de nouveaux clients et de nouvelles infrastructures.

---

# 6. Contraintes et exigences non fonctionnelles

## Disponibilité

Les clients de Lab42c étant principalement situés en Île-de-France, l'application est principalement utilisée durant les horaires de bureau.

Les exigences de disponibilité sont les suivantes :

- disponibilité du lundi au vendredi ;
- plage horaire de fonctionnement : **de 8h00 à 19h00** (heure de Paris) avec une disponibilité à 90% par mois ;
- les opérations de maintenance, de mise à jour ou de déploiement devront idéalement être réalisées en dehors de ces horaires.

Une disponibilité continue 24h/24 et 7j/7 n'est pas une exigence du projet.

## Compatibilité

L'application devra être développée sous la forme d'une **application web responsive**.

Elle devra être compatible avec :

- les ordinateurs (Windows, macOS et Linux) ;
- les tablettes ;
- les smartphones Android et iOS.

L'interface devra s'adapter automatiquement à la taille de l'écran afin de garantir une expérience utilisateur optimale quel que soit le terminal utilisé.

## Sécurité

L'application devra garantir :

- une authentification sécurisée ;
- une séparation stricte des droits entre les administrateurs Lab42c et les clients ;
- une isolation complète des données de chaque client ;
- la confidentialité des coûts réels AWS ;
- la protection des données conformément aux bonnes pratiques de sécurité.

## Évolutivité

La solution devra permettre :

- l'ajout de nouveaux clients ;
- l'ajout de nouvelles architectures AWS ;
- l'évolution des fonctionnalités sans remise en cause de l'architecture globale.

---

# 7. Critères d'acceptation

Le projet sera considéré comme conforme lorsque l'ensemble des critères suivants sera respecté.

## Critères fonctionnels

- Les fonctionnalités du back-office Lab42c sont entièrement opérationnelles ;
- Chaque client dispose d'un espace personnel sécurisé ;
- Les coûts réels des infrastructures AWS ne sont jamais visibles par les clients ;
- Les prévisions de facturation sont correctement calculées et affichées ;
- Les données sont correctement isolées entre les différents clients.

## Critères techniques

- La solution est développée sous la forme d'une **application web** ;
- L'application est **responsive** et utilisable sur ordinateur, tablette et smartphone ;
- L'application est disponible du **lundi au vendredi de 8h00 à 19h00** ;
- Les opérations de maintenance peuvent être réalisées en dehors de cette plage de disponibilité ;
- Les accès sont sécurisés et respectent la séparation des rôles entre administrateurs et clients.

## Critères économiques

- Le coût total de développement ne dépasse pas **50 000 €**.

## Critères de qualité

- Toutes les exigences fonctionnelles décrites dans ce document sont respectées ;
- Les exigences non fonctionnelles sont satisfaites ;
- L'application est stable, sécurisée et prête à être déployée sur l'infrastructure AWS de Lab42c ;
- L'interface offre une expérience utilisateur claire, intuitive et adaptée à des utilisateurs techniques comme non techniques.
