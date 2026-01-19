# Documentation Technique : Projet Municipal Link
**Système de Gestion du Patrimoine Municipal**

---

**Auteur :** Bilel Ayari B12  
**Date :** Janvier 2026  
**Version :** 1.0.0  

---

## 1. Introduction
Le projet **Municipal Link** est une application web moderne conçue pour la gestion informatisée du patrimoine immobilier d'une commune. Elle permet de suivre les biens municipaux, les contrats de location, les ventes et les flux financiers (paiements) de manière centralisée et sécurisée.

## 2. Objectifs du Projet
L'objectif principal est de remplacer les méthodes de suivi manuelles par une solution numérique performante :
- Centralisation des données immobilières.
- Automatisation du calcul des statistiques financières.
- Suivi rigoureux des échéances de paiement et des contrats expirés.
- Amélioration de la transparence dans la gestion des biens publics.

## 3. Architecture Technique
Le système repose sur une architecture **Client-Serveur** découplée :

### 3.1. Frontend (Interface Utilisateur)
Développé avec des technologies de pointe pour assurer une expérience utilisateur (UX) fluide et réactive :
- **React.js 18** : Bibliothèque principale pour la construction de l'interface.
- **TypeScript** : Pour un typage statique et une robustesse du code.
- **Vite** : Outil de build ultra-rapide pour le développement.
- **Tailwind CSS & shadcn/ui** : Framework CSS et bibliothèque de composants pour un design premium et responsive.
- **Lucide React** : Bibliothèque d'icônes vectorielles.
- **Recharts** : Pour la visualisation des données (Graphiques).

### 3.2. Backend (API REST)
Une API légère et performante développée en :
- **PHP 8.x** : Langage de script serveur pour le traitement des données.
- **PDO (PHP Data Objects)** : Pour une interaction sécurisée avec la base de données via des requêtes préparées (protection contre les injections SQL).
- **JSON** : Format d'échange de données entre le frontend et le backend.

### 3.3. Base de Données
- **MySQL / MariaDB** : Système de gestion de base de données relationnelle.
- Hébergé via l'environnement **XAMPP**.

## 4. Modèle de Données (Base de Données)
La base de données `municipal_link` est composée de 5 tables principales :
1. **users** : Gestion des comptes utilisateurs (Admin, Employé, Finance).
2. **biens** : Inventaire des propriétés (Cafés, Terrains, Locaux, etc.).
3. **locations** : Suivi des baux et contrats de location en cours.
4. **ventes** : Historique des aliénations de biens.
5. **paiements** : État de recouvrement des loyers mensuels.

## 5. Fonctionnalités Principales
- **Dashboard Dynamique** : Visualisation en temps réel des revenus et de l'état du patrimoine.
- **Gestion des Biens** : Module complet de création, modification et suppression des propriétés.
- **Suivi des Locations** : Gestion des locataires, des dates de début/fin et calcul automatique du temps restant.
- **Régie des Paiements** : Marquage des paiements comme payés ou en retard avec filtres avancés.
- **Authentification Sécurisée** : Système de connexion basé sur des rôles spécifiques.

## 6. Installation et Configuration

### Prérequis
- Node.js (v18+)
- XAMPP (Apache & MySQL)

### Étapes d'installation
1. **Frontend** :
   ```bash
   npm install
   npm run dev
   ```
2. **Backend** :
   - Importer `database.sql` dans PHPMyAdmin.
   - Placer le dossier `backend` dans `C:\xampp\htdocs\municipal-link-api`.
3. **Connexion** :
   - Utilisateur : `admin@commune.tn`
   - Mot de passe : `admin123`

## 7. Conclusion
Le projet Municipal Link combine modernité technologique et efficacité opérationnelle. Grâce à son architecture modulaire et son backend PHP/MySQL robuste, il offre une solution évolutive répondant aux besoins critiques de gestion des municipalités tunisiennes.

---
**Bilel Ayari B12**  
*Responsable du Développement*
