# Cahier des Charges Technique – Lab42c

# 1. Contexte technique

Le projet consiste à développer une application web permettant à Lab42c de piloter les coûts des infrastructures AWS de ses clients, ainsi que de fournir aux clients une estimation de leurs futures factures.

L’application doit s’intégrer dans un environnement AWS existant, respecter des contraintes de budget, de sécurité et de simplicité de maintenance, tout en offrant une expérience utilisateur adaptée à des profils techniques (Lab42c) et non techniques (clients médias).

---

# 2. Contraintes techniques globales

## 2.1 Contraintes fonctionnelles

- Séparation stricte des rôles (administrateur Lab42c / client)
- Isolation complète des données entre clients
- Accès aux coûts réels réservé à Lab42c
- Accès aux estimations de facturation réservé aux clients
- Centralisation des données de coûts et de facturation

## 2.2 Contraintes non fonctionnelles

- Application web responsive (desktop, tablette, mobile)
- Disponibilité adaptée aux usages métier : lundi–vendredi, 8h–19h (heure France)
- Hébergement sur AWS obligatoire
- Budget de développement plafonné à 50 000 €
- Sécurité renforcée (authentification, chiffrement, contrôle d’accès)
- Maintenabilité et évolutivité de la solution

---

# 3. Solutions techniques envisagées

Deux architectures ont été retenues afin de répondre aux besoins du projet. Elles représentent deux approches opposées : une architecture cloud-native serverless et une architecture monolithique conteneurisée.

## 3.1 Solution 1 – Architecture Serverless AWS (Solution recommandée)

### Stack technique

#### Frontend

- React
- TypeScript
- TailwindCSS
- Hébergement : Amazon S3 + CloudFront

#### Backend

- AWS Lambda
- API Gateway

#### Authentification

- Amazon Cognito

#### Base de données

- Amazon DynamoDB

#### Services complémentaires

- AWS CloudWatch (logs et monitoring)
- AWS IAM (gestion des permissions)
- AWS Cost Explorer API (récupération des coûts AWS)

### Description

Cette architecture repose sur un modèle 100 % serverless dans lequel aucune infrastructure serveur n’est maintenue en continu. Les traitements backend sont exécutés à la demande via AWS Lambda et exposés via API Gateway.

### Avantages

- Absence de gestion de serveurs
- Scalabilité automatique
- Coûts d’exploitation très faibles
- Intégration native avec AWS
- Déploiement rapide
- Maintenance réduite

### Inconvénients

- Modélisation NoSQL (DynamoDB) plus complexe
- Debugging distribué plus difficile
- Forte dépendance à AWS (vendor lock-in)

### Pertinence

Solution adaptée à :

- une application métier à trafic modéré
- une équipe orientée AWS
- une contrainte forte de réduction des coûts d’exploitation
- un besoin d’élasticité automatique

## 3.2 Solution 2 – Architecture Monolithique Conteneurisée

### Stack technique

#### Application

- Backend : Node.js (NestJS ou Express)
- Frontend : React (intégré ou séparé selon choix final)
- TypeScript

#### Infrastructure

- Docker
- AWS ECS Fargate ou EC2
- Application Load Balancer

#### Base de données

- Amazon RDS PostgreSQL

#### Authentification

- Amazon Cognito (commun aux deux solutions)

### Description

Cette architecture repose sur une application monolithique déployée sous forme de conteneur Docker. L’ensemble des fonctionnalités (API, logique métier, éventuellement frontend) est regroupé dans un même déploiement.

L’application est exécutée en continu sur une infrastructure ECS ou EC2 avec une base de données relationnelle dédiée.

### Avantages

- Architecture simple et lisible
- Contrôle total de l’environnement d’exécution
- Modélisation relationnelle adaptée aux besoins métier
- Requêtes SQL puissantes pour reporting et analyses
- Débogage plus simple que le serverless
- Approche classique en environnement entreprise

### Inconvénients

- Serveur ou conteneur toujours actif (coût fixe)
- Scalabilité moins automatique
- Maintenance infrastructure plus lourde
- Déploiement plus complexe que le serverless

### Pertinence

Solution adaptée à :

- des besoins métier structurés et complexes
- des exigences fortes en reporting et analyse de données
- une approche plus traditionnelle de l’architecture logicielle
- une préférence pour les bases relationnelles

---

# 4. Comparatif des solutions

| Critère                   | Solution 1 (Serverless AWS) | Solution 2 (Monolithe conteneurisé) |
| ------------------------- | --------------------------- | ----------------------------------- |
| Complexité infrastructure | Faible                      | Moyenne                             |
| Coût d’exploitation       | Très faible                 | Fixe plus élevé                     |
| Scalabilité               | Automatique                 | Manuelle ou semi-automatique        |
| Temps de développement    | Moyen                       | Moyen                               |
| Maintenance               | Faible                      | Moyenne                             |
| Flexibilité des requêtes  | Limitée (NoSQL)             | Excellente (SQL)                    |
| Débogage                  | Distribué complexe          | Plus simple                         |

---

# 5. Choix de l’architecture recommandée

## Solution retenue

La solution serverless AWS est retenue car elle répond le mieux aux contraintes du projet :

- intégration native dans l’écosystème AWS de Lab42c
- réduction maximale des coûts d’exploitation
- scalabilité automatique sans gestion serveur
- maintenance simplifiée
- adéquation avec une utilisation principalement en heures de bureau
- respect du budget de développement de 50 000 €

---

# 6. Déploiement automatique (CI/CD)

## 6.1 Objectif

Afin de garantir des mises en production fiables et reproductibles, le projet met en place une chaîne d'intégration et de déploiement continus (CI/CD).

Chaque modification validée sur la branche **main** du dépôt GitHub est automatiquement compilée, testée puis déployée sur l'infrastructure AWS. Cette automatisation permet de réduire les erreurs humaines, d'accélérer les mises en production et d'assurer une cohérence entre les différents environnements.

---

## 6.2 Services utilisés

Le pipeline de déploiement s'appuie sur les services suivants :

- **GitHub** : hébergement du code source et déclenchement du pipeline.
- **GitHub Actions** : compilation, tests et déploiement automatique.
- **AWS IAM** : authentification sécurisée entre GitHub et AWS via un rôle IAM (OIDC).
- **Amazon S3** : hébergement du frontend React.
- **Amazon CloudFront** : diffusion du site web et mise à jour du cache.
- **AWS Lambda** : déploiement des fonctions backend.
- **Amazon API Gateway** : exposition des API.
- **Amazon CloudWatch** : surveillance et centralisation des journaux.

---

## 6.3 Déroulement du déploiement

À chaque **push** sur la branche **main**, le pipeline exécute automatiquement les étapes suivantes :

1. Récupération du code source.
2. Installation des dépendances.
3. Compilation du frontend et du backend.
4. Exécution des tests automatiques.
5. Déploiement du frontend sur Amazon S3.
6. Invalidation du cache CloudFront.
7. Déploiement des fonctions AWS Lambda.
8. Vérification du déploiement et enregistrement des journaux dans CloudWatch.

Si une étape échoue, le déploiement est interrompu afin d'éviter la mise en production d'une version instable.

---

## 6.4 Avantages

L'automatisation du déploiement permet de :

- réduire les erreurs humaines ;
- accélérer les mises en production ;
- garantir des déploiements reproductibles ;
- assurer la traçabilité des versions déployées ;
- faciliter la maintenance et les évolutions futures.

---

## 6.5 Schéma du pipeline

```text
Développeur
      │
      ▼
GitHub (push sur main)
      │
      ▼
GitHub Actions
      │
 ┌───────────────┐
 │ Compilation   │
 │ Tests         │
 │ Build         │
 └───────────────┘
      │
      ▼
Déploiement AWS
 ├── Amazon S3 (Frontend)
 ├── CloudFront
 ├── AWS Lambda (Backend)
 └── API Gateway
      │
      ▼
CloudWatch
(Logs et supervision)
```

Cette chaîne CI/CD garantit un déploiement rapide, fiable et sécurisé de l'application tout en respectant les bonnes pratiques DevOps et les exigences de qualité définies dans ce cahier des charges.

---

# 7. Exigences qualité – ISO/IEC 25010:2011

Afin d'objectiver l'évaluation de la qualité logicielle du projet, les exigences non fonctionnelles et les choix d'architecture sont mis en correspondance avec le modèle de qualité produit défini par la norme, qui structure la qualité d'un logiciel autour de huit caractéristiques principales.

| Caractéristique               | Sous-caractéristiques                                                      | Application au projet                                                                                                                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Adéquation fonctionnelle**  | Complétude, exactitude, pertinence fonctionnelles                          | Couverture complète des besoins exprimés : suivi des coûts réels (Lab42c), estimation de facturation (client), séparation stricte des rôles et isolation des données par client.                                                                       |
| **Efficacité de performance** | Comportement temporel, utilisation des ressources, capacité                | Architecture **Lambda / API Gateway / DynamoDB** dimensionnée à la demande ; absence de sur-provisionnement ; temps de réponse adapté à un usage en heures de bureau (8 h–19 h).                                                                       |
| **Compatibilité**             | Coexistence, interopérabilité                                              | Intégration native avec l'écosystème AWS existant de Lab42c (**Cost Explorer API**, **IAM**, **CloudWatch**) sans conflit avec les ressources déjà en production.                                                                                      |
| **Utilisabilité**             | Reconnaissance de pertinence, apprenabilité, exploitabilité, accessibilité | Interface web responsive (ordinateur, tablette, mobile) développée avec **React** et **Tailwind CSS**, proposant des vues différenciées et simplifiées selon le profil (administrateur / client).                                                      |
| **Fiabilité**                 | Maturité, disponibilité, tolérance aux fautes, capacité de récupération    | Disponibilité ciblée pendant les heures ouvrées ; exécution serverless intrinsèquement résiliente (Lambda gérée par AWS) ; reprise automatique en cas d'échec d'invocation.                                                                            |
| **Sécurité**                  | Confidentialité, intégrité, non-répudiation, imputabilité, authenticité    | Authentification centralisée via **Amazon Cognito**, isolation stricte des données par client, permissions selon le principe du _least privilege_ via **IAM**, chiffrement des données au repos et en transit, traçabilité assurée par **CloudWatch**. |
| **Maintenabilité**            | Modularité, réutilisabilité, analysabilité, modifiabilité, testabilité     | Fonctions **Lambda** unitaires et découplées, déploiement _Infrastructure as Code_, maintenance réduite grâce à l'absence de gestion de serveurs, évolutions facilitées par le découpage en microservices fonctionnels.                                |
| **Portabilité**               | Adaptabilité, installabilité, remplaçabilité                               | Frontend statique **S3 / CloudFront** déployable sur toute infrastructure compatible ; dépendance forte à AWS pour le backend, assumée et justifiée par les gains de coût et de maintenance (cf. inconvénients de la solution 1).                      |

Cette mise en correspondance confirme que l'architecture serverless retenue (Solution 1) satisfait l'ensemble des caractéristiques du modèle ISO/IEC 25010, avec un point de vigilance identifié sur la portabilité, assumé au regard des bénéfices apportés en matière de coût et de maintenabilité.

---

# 8. Budget prévisionnel

## 8.1 Coût de développement

Le budget du développement est estimé sur la base des hypothèses suivantes :

- Durée du projet : **3 mois**
- Équipe : **3 développeurs**
- Rémunération moyenne : **4 000 € de charge totale mensuel par développeur (environ 2300 € net par mois)**

Ainsi, on obtient un total de **36 000 €** pour 3 mois de développement.

## 8.2 Coûts mensuels

Une estimation des coûts mensuels a été faite à l'aide de [calculator.aws](calculator.aws) ci-dessous :

| Service AWS           | Coût mensuel | Commentaire                                         |
| --------------------- | ------------ | --------------------------------------------------- |
| AWS Lambda            | 0.00 USD     | La formule gratuite est suffisante pour nos besoins |
| Amazon DynamoDB       | 0.30 USD     |                                                     |
| Amazon API Gateway    | 0.06 USD     |                                                     |
| Amazon CloudFront     | 15.00 USD    |                                                     |
| Amazon Cognito        | 3.50 USD     |                                                     |
| Amazon CloudWatch     | 1.50 USD     |                                                     |
| AWS Cost Explorer API | 3.00 USD     | Chaque requête coûte 0.01 USD                       |
| Nom de domaine        | 1.00 USD     | Exemple de nom de domaine : lab42c.fr               |
| **Total**             | 24.36 USD    |                                                     |

On obtient donc un total approximatif annuel de **292.32 USD**.

## 8.3 Analyse

Le budget global reste inférieur au plafond fixé de **50 000 €**, laissant une marge pour :

- imprévus techniques
- ajustements fonctionnels
- phase de recette / stabilisation

## 8.4 Remarque sur la durée

Une durée de **3 mois est réaliste mais optimiste**, sous réserve que :

- les besoins soient bien figés en amont
- les développements soient strictement cadrés
- l’équipe soit expérimentée sur AWS serverless

Une estimation plus prudente serait **3 à 4 mois** pour inclure tests et ajustements.

---

# 9. User Stories – Solution 1 (Serverless AWS)

## 9.1 Rôle : Administrateur Lab42c

### US-1 : Visualisation des coûts globaux

En tant qu’administrateur Lab42c, je veux consulter les coûts AWS par client et par projet afin de suivre les dépenses globales.

### US-2 : Suivi des marges

En tant qu’administrateur, je veux visualiser la différence entre coûts AWS et facturation client afin de suivre la rentabilité de chaque projet.

### US-3 : Gestion des clients

En tant qu’administrateur, je veux accéder à la liste des clients et de leurs architectures afin de gérer le portefeuille global.

### US-4 : Analyse des tendances

En tant qu’administrateur, je veux consulter l’évolution des coûts dans le temps afin d’anticiper les dérives budgétaires.

## 8.2 Rôle : Client

### US-5 : Consultation de la facturation prévisionnelle

En tant que client, je veux consulter mes futures factures afin d’anticiper mes dépenses mensuelles.

### US-6 : Suivi de consommation

En tant que client, je veux visualiser l’évolution de mes coûts afin de comprendre l’impact de mon infrastructure.

### US-7 : Accès sécurisé à mes données

En tant que client, je veux accéder uniquement à mes propres données afin de garantir la confidentialité.

### US-8 : Consultation multi-support

En tant que client, je veux accéder à l’application depuis mon ordinateur ou mon téléphone afin de suivre mes coûts facilement.

## 8.3 Rôle : Système

### US-9 : Agrégation des coûts AWS

En tant que système, je dois récupérer et agréger les données AWS afin de fournir des indicateurs fiables.

### US-10 : Calcul des estimations

En tant que système, je dois calculer les prévisions de facturation afin d’afficher des projections cohérentes aux utilisateurs.

---

# 10. Conclusion technique

L’architecture serverless AWS constitue le meilleur compromis entre coût, performance et évolutivité, tout en garantissant une intégration optimale dans l’environnement technique existant de Lab42c.

La solution monolithique conteneurisée reste une alternative viable dans un contexte où la complexité métier ou les besoins en reporting relationnel deviendraient prioritaires.
