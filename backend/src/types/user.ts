// Interface complète d'un utilisateur
export interface User {
    id: string;          // Identifiant unique de l'utilisateur
    email: string;       // Email de l'utilisateur (unique)
    password: string;    // Mot de passe hashé
    name: string;        // Nom de l'utilisateur
    role: 'USER' | 'ADMIN';  // Rôle : soit USER soit ADMIN uniquement
    createdAt: Date;     // Date de création du compte
    updatedAt: Date;     // Date de dernière modification
  }
  
  // Interface pour la création d'un utilisateur
  export interface UserCreateInput {
    email: string;       // Email requis
    password: string;    // Mot de passe requis
    name: string;        // Nom requis
    role?: 'USER' | 'ADMIN';  // Rôle optionnel (? signifie optionnel)
  }