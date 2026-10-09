# IPEST — Inscription à la sortie Dougga & Testour

Site d'inscription à la sortie culturelle du **jeudi 15 octobre 2026**, organisé par le Service Socio-Culturel de l'IPEST, avec un **espace organisateur** (`/admin`) protégé par mot de passe.

Les inscriptions ferment le **lundi 12 octobre 2026 à minuit** (heure de Tunis). Un compte à rebours est affiché sur le site. Après l'échéance, le formulaire se ferme, et le serveur refuse lui aussi toute nouvelle inscription.

```
Étudiant ─▶ site (React) ─▶ /api/register (fonction Vercel) ─▶ base PostgreSQL (Neon)
Organisateur ─▶ /admin ─▶ /api/admin/* (session sécurisée) ─▶ même base
```

## Fonctionnalités

**Formulaire public.** Quatre champs, tous obligatoires : Nom, Prénom, Numéro de téléphone et Classe.

- Les erreurs s'affichent en français, à la fois sur le téléphone et côté serveur.
- Les numéros tunisiens sont acceptés avec ou sans `+216`, puis enregistrés au format `+216 XX XXX XXX`.
- Un même numéro ne peut pas être inscrit deux fois.
- Les données sont mises en forme automatiquement : NOM en majuscules, Prénom avec une majuscule initiale, CLASSE en majuscules.
- Le message de succès ne s'affiche **qu'après** l'enregistrement effectif en base.
- Un champ piège invisible bloque les robots.

**Espace organisateur (`/admin`).**

- Chiffres clés : nombre d'inscrits, inscriptions du jour, nombre de classes, temps restant avant la clôture.
- Répartition par classe. Touchez une classe pour filtrer la liste.
- Recherche par nom, prénom, téléphone ou classe, sans tenir compte des accents.
- Tri : plus récentes, plus anciennes, par nom ou par classe.
- Sur téléphone, les inscriptions s'affichent en cartes avec un bouton d'appel direct. Sur ordinateur, elles s'affichent en tableau.
- **Export Excel** (CSV compatible Excel et Google Sheets) de la liste affichée.
- **Impression** d'une liste d'appel alphabétique avec une colonne « Présent », pratique dans le bus. Elle tient compte du filtre de classe.
- Suppression d'une inscription, avec confirmation.
- Actualisation automatique toutes les 30 secondes.

**Sécurité.**

- Mot de passe vérifié côté serveur.
- Session de 12 heures dans un cookie `HttpOnly`, `Secure` et `SameSite=Strict`.
- Blocage pendant 15 minutes après 8 mauvais mots de passe venant d'une même adresse.
- L'espace organisateur n'est pas indexé par les moteurs de recherche.
- Aucun secret n'est présent dans le code envoyé au navigateur.

---

## 1. Mise en ligne sur Vercel (environ 10 minutes)

1. Sur <https://vercel.com>, cliquez sur **Add New → Project** et importez le dépôt GitHub `formulaire_ipest`.
   Vercel détecte Vite tout seul. Cliquez sur **Deploy**.
2. **Créez la base de données.** Dans le projet Vercel, ouvrez **Storage → Create Database → Neon (Postgres)**, choisissez le plan gratuit, puis **Connect** au projet.
   La variable `DATABASE_URL` est ajoutée automatiquement. Les tables se créent seules à la première inscription.
3. **Choisissez le mot de passe organisateur.** Dans **Settings → Environment Variables**, ajoutez :

   | Nom | Valeur |
   |---|---|
   | `ADMIN_PASSWORD` | un mot de passe long et unique (12 caractères ou plus) |

4. Ouvrez **Deployments**, puis **⋯ → Redeploy** pour prendre en compte les variables.

Une fois ces étapes terminées :

- le site est disponible à `https://<votre-projet>.vercel.app` ;
- l'espace organisateur est disponible à `https://<votre-projet>.vercel.app/admin`.

### Vérifier que tout fonctionne

1. Inscrivez-vous sur le site avec votre propre numéro. Le panneau vert « Inscription enregistrée ! » doit apparaître.
2. Réessayez avec le même numéro. Le site doit répondre « Ce numéro de téléphone est déjà inscrit ».
3. Ouvrez `/admin` et connectez-vous. L'inscription de test apparaît. Supprimez-la avec l'icône 🗑.

Si le site affiche « Le service n'est pas encore configuré », une variable manque (`DATABASE_URL` ou `ADMIN_PASSWORD`). Ajoutez-la, puis faites un **Redeploy**.

## 2. Développement local

```bash
npm install
cp .env.example .env      # puis renseignez ADMIN_PASSWORD
npm run dev               # site : http://localhost:5173 · admin : http://localhost:5173/admin
npm test                  # 33 tests : validation, API (sur un vrai PostgreSQL embarqué), export…
npm run build
```

En local, laissez `DATABASE_URL` vide : une base PostgreSQL embarquée (PGlite) est créée dans `.data/`. Elle n'est jamais publiée. Supprimez ce dossier pour repartir de zéro.

## 3. Maintenance

| Besoin | Où |
|---|---|
| Changer la date limite | `DEADLINE_ISO` et `DEADLINE_LABEL` dans `src/config.js` (utilisés par le site **et** l'API) |
| Proposer une liste de classes (menu déroulant) | `CLASS_OPTIONS` dans `src/config.js`. L'option « Autre » reste disponible |
| Ajouter le logo officiel | Placez le fichier dans `public/`, puis définissez `LOGO_SRC` dans `src/config.js` |
| Changer le mot de passe organisateur | Modifiez `ADMIN_PASSWORD` sur Vercel, puis faites un Redeploy. Les sessions ouvertes sont fermées |
| Récupérer toutes les données | Bouton **Excel** dans `/admin`, ou console Neon (onglet *Tables*) |

## Structure

```
api/register.js              POST  inscription publique
api/admin/login.js           POST  connexion organisateur
api/admin/logout.js          POST  déconnexion
api/admin/session.js         GET   état de la session
api/admin/registrations.js   GET   liste · DELETE ?id= suppression
server/                      base de données, session, utilitaires HTTP
src/                         site public (React) + src/admin/ (espace organisateur)
src/lib/validation.js        règles de validation partagées site / serveur
tests/                       tests automatisés (node --test)
```

Données collectées : nom, prénom, téléphone et classe, plus la date d'inscription. Il n'y a ni cookie de suivi ni outil de mesure d'audience.
