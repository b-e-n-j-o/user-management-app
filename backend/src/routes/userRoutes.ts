import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth';
import { checkRole } from '../middlewares/roleMiddleware';

const router = Router();

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', authMiddleware, userController.getUsers);

// Routes accessibles uniquement aux admins
router.put('/:id', authMiddleware, checkRole(['ADMIN']), userController.updateUser);
router.delete('/:id', authMiddleware, checkRole(['ADMIN']), userController.deleteUser);

export default router;

/*
Droits d'accès aux routes :

1. GET / (Liste des utilisateurs)
   - Accessible à tous les utilisateurs authentifiés
   - Nécessite uniquement le middleware d'authentification

2. PUT /:id (Modification d'un utilisateur)
   - Accessible uniquement aux administrateurs
   - Nécessite l'authentification ET le rôle ADMIN

3. DELETE /:id (Suppression d'un utilisateur)
   - Accessible uniquement aux administrateurs  
   - Nécessite l'authentification ET le rôle ADMIN
*/