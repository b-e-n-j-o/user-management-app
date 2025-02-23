import { Request, Response, NextFunction } from 'express';

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Vérifier si l'utilisateur existe dans la requête (ajouté par authMiddleware)
      if (!req.user) {
        return res.status(401).json({ error: 'Non authentifié' });
      }

      // Vérifier si le rôle de l'utilisateur est autorisé
      const userRole = req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Accès non autorisé pour votre rôle' 
        });
      }

      // Si tout est OK, passer à la suite
      next();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la vérification du rôle' });
    }
  };
};