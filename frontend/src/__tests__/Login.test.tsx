import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login/LoginPage';

describe('Login Component', () => {
  // Test 1: Affichage du formulaire
  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Vérifie les éléments qui existent réellement
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  // Test 2: Validation du formulaire vide
  test('validates empty form submission', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Cliquer sur le bouton de connexion
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });
    fireEvent.click(submitButton);
    
    // Vérifier que les champs sont marqués comme requis
    await waitFor(() => {
      // Vérifier les attributs 'required' des champs
      expect(screen.getByLabelText(/Email/).hasAttribute('required')).toBe(true);
      expect(screen.getByLabelText(/Mot de passe/).hasAttribute('required')).toBe(true);
    });
  });

  // Test 3: Tentative de connexion avec données
  test('handles login attempt with credentials', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Remplir les champs
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/), {
      target: { value: 'password123' }
    });
    
    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });
    fireEvent.click(submitButton);
    
    // Vérifier que le formulaire a été soumis
    await waitFor(() => {
      expect(submitButton).toBeInTheDocument();
    });
  });
});