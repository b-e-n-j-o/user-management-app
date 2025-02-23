import app from '../index';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Routes Permissions', () => {
  let adminToken: string;
  let userToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Créer un utilisateur de test avec un email unique pour nos tests
    const testUser = await prisma.user.create({
      data: {
        email: `testuser${Date.now()}@test.com`,
        password: 'hashedPassword',
        role: 'USER',
        name: 'Test User'
      }
    });
    testUserId = testUser.id;

    // Utiliser les vrais emails pour les tokens
    adminToken = jwt.sign(
      { email: 'benjamin.benoit21@hotmail.fr', role: 'ADMIN' },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    userToken = jwt.sign(
      { email: `testuser${Date.now()}@test.com`, role: 'USER' },
      process.env.JWT_SECRET || 'your-secret-key'
    );
  });

  describe('GET /api/users', () => {
    test('allows both admin and regular users to view list', async () => {
      const adminResponse = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(adminResponse.status).toBe(200);

      const userResponse = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);
      expect(userResponse.status).toBe(200);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('allows admin to modify users', async () => {
      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: `updated${Date.now()}@test.com` });
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('allows admin to delete users', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
    });
  });

  afterAll(async () => {
    // Supprimer uniquement l'utilisateur de test
    await prisma.user.delete({
      where: { id: testUserId }
    }).catch(() => {
      // Ignorer l'erreur si l'utilisateur a déjà été supprimé par le test DELETE
    });
    await prisma.$disconnect();
  });
});