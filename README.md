# Système de Gestion du Trafic Urbain 🚦

Ce projet est une solution complète de gestion du trafic urbain basée sur une architecture microservices. Il permet la surveillance en temps réel des zones de trafic, la gestion des incidents, le suivi GPS des véhicules et la notification automatique des usagers.

##  Architecture du Système

Le système est découpé en plusieurs microservices spécialisés communiquant via une passerelle API (API Gateway) utilisant GraphQL.

- **API Gateway (Port 4000)** : Point d'entrée unique pour le frontend, agrégeant les données de tous les services.
- **Auth Service (Port 3001)** : Gestion des utilisateurs, rôles (Administrateur, Opérateur) et authentification JWT.
- **Trafic Service (Port 3003)** : Surveillance de la densité du trafic par zones.
- **Incidents Service (Port 3004)** : Déclaration et suivi des incidents routiers.
- **Véhicules Service (Port 3002)** : Gestion de la flotte et suivi GPS en temps réel.
- **Notifications Service (Port 3005)** : Système d'alerte (incluant l'intégration WhatsApp Cloud API).
- **Frontend (Port 3000)** : Interface utilisateur moderne développée avec Next.js 15+ et Apollo Client.

##  Technologies Utilisées

### Backend
- **Framework** : [NestJS](https://nestjs.com/) (Node.js)
- **API** : [GraphQL](https://graphql.org/) (Apollo Federation)
- **Base de données** : [PostgreSQL 16](https://www.postgresql.org/)
- **Authentification** : JWT (JSON Web Tokens)

### Frontend
- **Framework** : [Next.js 15](https://nextjs.org/) (React)
- **Client API** : [Apollo Client](https://www.apollographql.com/docs/react/)
- **Styling** : Tailwind CSS

### Infrastructure
- **Conteneurisation** : [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **CI/CD** : GitHub Actions

##  Installation et Démarrage

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé sur votre machine.
- Un fichier `.env` configuré (voir `.env.example`).

### Lancement avec Docker Compose
La méthode recommandée pour lancer l'ensemble du projet est d'utiliser Docker Compose :

```bash
# Construire et lancer tous les conteneurs
docker-compose up -d --build
```

Une fois le processus terminé, vous pouvez accéder aux différents services :
- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **GraphQL Playground (Gateway)** : [http://localhost:4000/graphql](http://localhost:4000/graphql)

### Vérification de l'état des services
```bash
docker-compose ps
```

##  Cas d'Utilisation

- **Administrateur** : Gestion complète des utilisateurs, configuration des zones de trafic et supervision globale.
- **Opérateur** : Gestion des incidents en temps réel et suivi de la flotte de véhicules.
- **Système GPS** : Alimentation automatique des positions des véhicules via l'API.

##  Structure du Projet

```text
.
├── api-gateway/          # Passerelle GraphQL
├── auth-service/         # Service d'authentification
├── incidents-service/    # Gestion des incidents
├── notifications-service/# Système d'alertes
├── trafic-service/       # Surveillance du trafic
├── vehicules-service/    # Suivi GPS et flotte
├── frontend/             # Interface utilisateur Next.js
└── docker-compose.yml    # Configuration de l'orchestration
```

##  Sécurité
Les communications entre le frontend et l'API Gateway sont sécurisées par des tokens JWT. Les services internes sont protégés derrière le réseau Docker, seule la passerelle et le frontend sont exposés publiquement.

---
Projet réalisé dans le cadre d'un **PFE (Projet de Fin d'Études)**.
