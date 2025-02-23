import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';  // Enlever .ts
import userRoutes from './routes/userRoutes';  // Enlever .ts

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Ajout des routes d'authentification
app.use('/api/auth', authRoutes);

// Ajouter les routes utilisateur
app.use('/api/users', userRoutes);

// Route de test existante
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 4000;

// Fonction pour démarrer le serveur, utilisée pour les tests
export const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    return app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default app;

// Ne démarrer le serveur que si ce n'est pas un test
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

/*
Ce fichier représente le point d'entrée principal de l'application backend.
Il configure un serveur Express avec les middlewares essentiels (CORS, parsing JSON).

La fonction startServer est exportée séparément pour permettre aux tests de contrôler
le démarrage du serveur. En mode test (NODE_ENV=test), le serveur ne démarre pas
automatiquement, ce qui permet aux tests d'éviter les conflits de ports et de gérer
le cycle de vie du serveur. En mode normal, le serveur démarre automatiquement.

L'application établit une connexion à la base de données PostgreSQL via Prisma,
et expose une route /health pour vérifier l'état du serveur. L'architecture utilise
TypeScript pour une meilleure maintenabilité du code.
*/