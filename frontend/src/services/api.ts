// Import des dépendances nécessaires
import axios from 'axios';
import { User } from '../types/user';
import { RegisterData } from '../types/user';

// URL de base de l'API
const API_URL = 'http://localhost:4000/api';

// Création d'une instance axios avec l'URL de base
export const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur qui ajoute automatiquement le token d'authentification aux requêtes
// Récupère le token du localStorage et l'ajoute aux headers 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service d'authentification contenant les méthodes de login et register
export const authService = {
  // Méthode de connexion - envoie email/password et retourne les données utilisateur
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  // Méthode d'inscription - envoie les données d'inscription et retourne l'utilisateur créé
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }
};

// Service de gestion des utilisateurs avec les opérations CRUD
export const userService = {
  // Récupère la liste des utilisateurs avec possibilité de recherche
  getUsers: async (searchTerm?: string) => {
    console.log('API call with search:', searchTerm);
    const response = await api.get('/users', {
      params: searchTerm ? { search: searchTerm } : {}
    });
    console.log('API response:', response.data);
    return response.data;
  },
  
  // Récupère un utilisateur spécifique par son ID
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  // Met à jour les données d'un utilisateur
  updateUser: async (id: string, data: Partial<User>) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  
  // Supprime un utilisateur
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};