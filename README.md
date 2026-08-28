# Exam Hub — Frontend

SPA React/Vite en JavaScript pour l'application Exam Hub.

## Prérequis

- Node.js 20+
- npm
- Backend Exam Hub lancé sur `http://localhost:4000`

## Installation

```bash
git clone <url-du-repo-frontend>
cd exam-hub-frontend
cp .env.example .env
npm install
npm run dev
```

Application : `http://localhost:5173`

## Configuration

```env
VITE_API_URL=http://localhost:4000/api
```

## Stack

- React
- Vite
- JavaScript
- `react-router-dom`
- `BrowserRouter`
- API via `fetch`
- JWT + informations utilisateur stockés dans `localStorage`
- Syntaxe ECMAScript `import` / `export`

## Routes

```text
/login

/admin
/admin/students
/admin/courses
/admin/exams
/admin/exams/:id/questions
/admin/exams/:id/results

/student
/student/exams/:id
/student/exams/:id/result
/student/results
```

`ProtectedRoute` applique les règles suivantes :

- utilisateur non connecté → `/login` ;
- étudiant essayant d'ouvrir `/admin/...` → `/student` ;
- administrateur essayant d'ouvrir `/student/...` → `/admin`.

## Fonctionnalités administrateur

- Tableau de bord avec compteurs.
- Création/modification des étudiants.
- Réinitialisation du mot de passe étudiant.
- Désactivation et réactivation des comptes.
- CRUD des cours.
- CRUD des examens.
- Éditeur de questions : 2 à 6 choix, une bonne réponse.
- Affichage visuel du verrouillage après une tentative.
- Consultation des résultats et de la moyenne.

## Fonctionnalités étudiant

- Liste des examens actuellement disponibles et non encore passés.
- Toutes les questions sur une seule page.
- Un seul choix par question.
- Soumission partielle autorisée conformément à RG-05.
- Confirmation avant soumission définitive.
- Note immédiate.
- Correction question par question.
- Historique des résultats.
- Accès direct à une ancienne correction grâce à `GET /api/my/results?examId=...`.

## Comptes de test

Créés par le `seed.sql` du backend :

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@examhub.local` | `Admin123!` |
| Étudiant | `alice@examhub.local` | `Student123!` |

## Build

```bash
npm run build
npm run preview
```
