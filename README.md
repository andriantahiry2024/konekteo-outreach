# KONEKTEO — APPLICATION DE PROSPECTION AUTONOME (B2B)
> **Solution concrète, visuellement minimaliste et ultra-simple. Zéro usine à gaz technique.**

---

## 1. Vision & Architecture (Inspirée des patterns Ponytail & ECC)

Cette application incarne la philosophie radicale **anti-complexité** de Konekteo :
1. **Ponytail Ladder of Laziness** :
   - *YAGNI & Simplicité* : Pas de formulaires interminables, pas de configuration de serveurs DNS/SPF/DKIM demandée à l'utilisateur.
   - *Platform Native* : Next.js 14 standalone, conteneurisation légère multi-stage, déploiement 1-clic.
2. **ECC Framework (Engineering Closed-Loop)** :
   - Coordination Squad (Product Designer, Marketing, Avocat du Diable, Orchestrateur).
   - Validation continue de l'expérience utilisateur et de la délivrabilité.

---

## 2. Fonctionnalités Clés Livrées

- **Les 3 Métriques Essentielles en Direct** :
  - **Rendez-vous qualifiés** : Total de décideurs ayant réservé un créneau (+5 cette semaine).
  - **Taux d'intérêt qualifié** : Ratio net de réponses positives (18.2% vs 3% moyenne marché).
  - **Envois actifs du jour** : Suivi de sécurité avec jauge d'activité (135/150).
- **Gestion des 3 Adresses d'Expédition (Rotation Intelligente)** :
  - Suivi de réputation (100% Inbox).
  - Répartition de la charge sur 3 domaines pour éliminer tout risque de spam.
  - Zéro configuration technique demandée au dirigeant.
- **Boîte de Réception Simplifiée & Réponse en 1 Clic** :
  - Triage automatique par intention (Intéressé / Question / Plus tard).
  - Proposition de réponse contextuelle rédigée instantanément, prête à valider sans effort mental.
  - Bascule du statut (Traité / Action requise).
- **Master Switch "Zéro Tracas"** :
  - Bouton Activer / Mettre en pause la prospection en 1 seconde.
  - Simulateur temps réel de prospects entrants pour les démonstrations.

---

## 3. Déploiement Coolify & GitHub

Cette application est **prête pour la production** sur n'importe quelle instance Coolify :

### Option A : Déploiement automatique Nixpacks (Recommandé)
Coolify détecte automatiquement le projet Next.js via le fichier `nixpacks.toml` :
1. Sur Coolify, aller dans **New Resource** > **Git Repository**.
2. Connecter le repo GitHub Konekteo.
3. Sélectionner la branche `main`.
4. Build pack : **Nixpacks**. Port : **3000**.
5. Cliquer sur **Deploy**.

### Option B : Déploiement Dockerfile Standalone
Le fichier `Dockerfile` utilise le mode multi-stage standalone de Next.js pour une image ultra-légère (< 120 Mo) et sécurisée (utilisateur non-root `nextjs`).

---

## 4. Lancement en Local

```bash
cd konekteo-app
npm install
npm run dev
```

L'application démarre immédiatement sur `http://localhost:3000`.
