# Konekteo Outreach — socle réel

Application de suivi de prospection **opérée par Konekteo** (modèle service).
Aucune donnée fictive : tout ce qui est affiché provient de PostgreSQL.

## Ce qui existe

| Route | Rôle |
|---|---|
| `/login` | Le client demande son lien d'accès (aucun mot de passe) |
| `/s/<token>` | Lien magique : ouvre une session de 30 jours puis redirige vers `/app` |
| `/app` | Espace client : métriques réelles (30 derniers jours), boîtes d'envoi, réponses prospects |
| `/admin/login` | Console interne protégée par `ADMIN_PASSWORD` |
| `/admin` | Liste des clients + création |
| `/admin/client/<id>` | Console opérateur : générer le lien du client, ajouter une boîte, enregistrer une journée d'envois, ajouter une réponse prospect |

## Variables d'environnement

- `DATABASE_URL` — PostgreSQL (interne Coolify)
- `SESSION_SECRET` — signature des sessions et des liens magiques
- `ADMIN_PASSWORD` — accès console interne

Aucune de ces variables n'est nécessaire au build : elles sont *runtime only*.

## Base de données

`db/schema.sql` est appliqué automatiquement au démarrage du conteneur
(`scripts/migrate.mjs`, idempotent). Tables : `clients`, `magic_links`,
`sender_inboxes`, `sends`, `replies`.

Métriques calculées en SQL, jamais stockées en dur :
- envoyés aujourd'hui = `count(sends where sent_at >= date_trunc('day', now()))`
- plafond du jour = `sum(sender_inboxes.daily_limit)`
- taux d'ouverture 30 j = `opened_at not null / total`
- réponses chaudes = réponses hors « relancer plus tard »

## Déploiement

Coolify → projet `Konekteo`, application `konekteo-outreach`, build Docker (`Dockerfile`, sortie standalone).
Chaque `git push` sur `main` peut être redéployé via l'API Coolify (`POST /api/v1/deploy`).

## Ce qui n'existe pas encore (assumé)

- envoi d'e-mails réel (SMTP/domaines, réchauffage, rotation)
- sourcing automatique de prospects
- facturation
- suppression d'un client depuis la console
