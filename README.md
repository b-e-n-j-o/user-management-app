# README - Application de Gestion des Utilisateurs

## Prérequis
- [Docker](https://www.docker.com/get-started) installé sur votre machine
- Git installé

## Installation et Démarrage
### 1. Cloner le dépôt
```sh
git clone https://github.com/b-e-n-j-o/user-management-app.git
cd user-management-app
```

### 2. Configurer les variables d'environnement
Dans le dossier racine, créez un fichier `.env` et ajoutez les variables suivantes :
```env
# Configuration de la base de données PostgreSQL
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name

# URL de connexion à la base de données
DATABASE_URL=postgresql://your_user:your_password@your_host:your_port/your_db

# Secret pour JWT
JWT_SECRET=your_jwt_secret

# Port du backend
PORT=4000
```

### 3. Lancer l'application avec Docker
```sh
docker compose up --build
```
> Si vous utilisez une version plus ancienne de Docker, utilisez `docker-compose up --build`

## Accès aux Services
- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend** : [http://localhost:4000](http://localhost:4000)
- **PostgreSQL** : Accessible sur `localhost:5432` avec les identifiants définis dans `.env`

## Tests
### 1. Tester l'API avec Postman
- Vérifiez l'authentification en envoyant une requête `POST /login`
- Accédez aux utilisateurs authentifiés avec `GET /api/users` (nécessite un token JWT dans le header `Authorization`)

### 2. Lancer les tests automatisés
#### Backend (Node.js + Jest)
```sh
cd backend
npm install
npm test
```
#### Frontend (React + Jest)
```sh
cd frontend
npm install
npm test
```

L'application est maintenant prête à être testée ! 🚀

