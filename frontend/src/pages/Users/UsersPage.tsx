import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  InputAdornment,
  Pagination,
  Stack,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SortByAlpha as SortIcon,
  Logout as LogoutIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { userService } from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import EditUserDialog from '../../components/EditUserDialog';
import { User } from '../../types/user';

// Styles personnalisés
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(31, 38, 135, 0.25)',
  },
}));

const UserListItem = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.2s ease-in-out',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.95)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
    transform: 'scale(1.01)',
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
}));

const PageContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: '#2C3E50', // Un gris foncé moderne et sobre
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.9)',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.9)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  padding: '8px 16px',
}));

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const usersPerPage = 3;

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: any = jwtDecode(token);
          setIsAdmin(decoded.role === 'ADMIN');
        }
        await loadUsers();
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    let filtered = users.filter((user: any) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter((user: any) => user.role === roleFilter);
    }

    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredUsers(filtered);
    setPage(1);
  }, [searchTerm, users, roleFilter, sortOrder]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    loadUsers();
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((user: any) => user.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <PageContainer maxWidth={false}>
      <Container maxWidth="md">
        <StyledCard elevation={0}>
          <CardContent>
            {/* Header */}
            <HeaderBox>
              <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Liste des utilisateurs Cohabs
              </Typography>
              <StyledButton
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                color="primary"
              >
                Déconnexion
              </StyledButton>
            </HeaderBox>

            {/* Filtres */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
              <StyledTextField
                fullWidth
                placeholder="Rechercher un utilisateur..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Rôle</InputLabel>
                <StyledSelect
                  value={roleFilter}
                  label="Rôle"
                  onChange={(e) => setRoleFilter(e.target.value as string)}
                >
                  <MenuItem value="ALL">Tous</MenuItem>
                  <MenuItem value="USER">Utilisateurs</MenuItem>
                  <MenuItem value="ADMIN">Administrateurs</MenuItem>
                </StyledSelect>
              </FormControl>

              <StyledButton
                variant="contained"
                startIcon={<SortIcon />}
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                color="primary"
              >
                {sortOrder === 'desc' ? 'Plus récent' : 'Plus ancien'}
              </StyledButton>
            </Stack>

            {/* Liste des utilisateurs */}
            <Stack spacing={2}>
              {filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage).map((user: any) => (
                <UserListItem key={user.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                        <Typography color="textSecondary" sx={{ mb: 1 }}>
                          {user.email}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={user.role}
                            color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                            size="small"
                            sx={{ borderRadius: '8px' }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            Créé le {new Date(user.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      {isAdmin && (
                        <Box>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(user)}
                            size="small"
                            sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(user.id)}
                            size="small"
                            sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </UserListItem>
              ))}
            </Stack>

            {/* Pagination */}
            {Math.ceil(filteredUsers.length / usersPerPage) > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={Math.ceil(filteredUsers.length / usersPerPage)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>
            )}
          </CardContent>
        </StyledCard>
      </Container>

      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </PageContainer>
  );
};

export default UsersPage;