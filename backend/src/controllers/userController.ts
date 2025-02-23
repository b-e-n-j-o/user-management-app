// READ UPDATE DELETE

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const userController = {
  // Liste des utilisateurs
  async getUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  },

  // Obtenir un utilisateur
  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
  },

  // Mettre à jour un utilisateur
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Préparer les données à mettre à jour
      const updateData: any = {};
      
      if (name) updateData.name = name;
      if (email) {
        // Vérifier si le nouvel email n'est pas déjà utilisé
        const emailExists = await prisma.user.findFirst({
          where: {
            email,
            NOT: {
              id: id
            }
          }
        });

        if (emailExists) {
          return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }
        updateData.email = email;
      }
      
      // Si un nouveau mot de passe est fourni, le hasher
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Mettre à jour l'utilisateur
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.json({
        message: 'Utilisateur mis à jour avec succès',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
  },

  // Supprimer un utilisateur
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id }
      });
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  }
};