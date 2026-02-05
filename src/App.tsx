import { useState, useEffect } from 'react';
import { Container, Box, Typography, Alert } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import userService from './services/userService';
import type { User } from './types';
import './App.css';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingUser(null);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleOpenEditForm = (user: User) => {
    setEditingUser(user);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser(userData);
      setUsers([...users, newUser]);
      toast.success('User added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userData: Omit<User, 'id'>) => {
    if (!editingUser?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(editingUser.id, userData);
      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
      toast.success('User updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete?.id) return;

    setIsDeleting(true);
    setError(null);
    try {
      await userService.deleteUser(userToDelete.id);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      toast.success('User deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setDeleteDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingUser(null);
    setError(null);
  };

  return (
    <div className="app-background">
      <Container maxWidth="lg" sx={{ py: 4 }}>
     
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            User Management System
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Create, read, update, and manage your users efficiently
          </Typography>
        </Box>

     
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

      
        <UserList
          users={users}
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteClick}
          onCreate={handleOpenCreateForm}
          isLoading={isLoading}
        />
      </Container>

     
      <UserForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={formMode === 'create' ? handleCreateUser : handleUpdateUser}
        initialData={editingUser || undefined}
        isLoading={isLoading}
        mode={formMode}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        isLoading={isDeleting}
        userName={
          userToDelete
            ? `${userToDelete.firstName} ${userToDelete.lastName}`
            : undefined
        }
      />

     
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
