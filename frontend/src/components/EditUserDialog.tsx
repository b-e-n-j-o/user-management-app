import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import { userService } from '../services/api';

interface EditUserDialogProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, open, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: ''  // Champ vide par défaut
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      // Ne pas envoyer le mot de passe s'il est vide
      const dataToUpdate = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password })
      };

      await userService.updateUser(user.id, dataToUpdate);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier l'utilisateur</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Nouveau mot de passe (optionnel)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;