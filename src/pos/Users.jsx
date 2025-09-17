import React, { useState } from 'react';
import { useUsers } from '../context/UserContext';
import apiClient from '../api/axiosConfig';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell, Chip,
  TableContainer, TableHead, TableRow, IconButton, Modal, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function Users() {
  const { users, fetchUsers } = useUsers();
  
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  // --- CAMBIO CLAVE 1: El rol por defecto ahora coincide con el backend ---
  const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '', role: 'ROLE_USER', password: '' });
  
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentUser({ id: null, name: '', email: '', role: 'ROLE_USER', password: '' });
    setOpenModal(true);
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser({ ...user, password: '' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        // La edición requeriría un endpoint específico en el backend.
        // await apiClient.put(`/api/users/${currentUser.id}`, currentUser);
        alert("La funcionalidad de editar usuarios aún no está implementada en el backend.");
      } else {
        await apiClient.post('/api/auth/register', {
            name: currentUser.name,
            email: currentUser.email,
            password: currentUser.password,
            role: currentUser.role
        });
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        alert("No se pudo guardar el usuario. Verifique que el correo no esté ya en uso.");
    }
  };
  
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      // La eliminación requeriría un endpoint específico.
      // await apiClient.delete(`/api/users/${userToDelete.id}`);
      alert("La funcionalidad de eliminar usuarios aún no está implementada en el backend.");
      handleCloseConfirmDialog();
    } catch (error) {
       console.error("Error al eliminar usuario:", error);
       alert("No se pudo eliminar el usuario.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Gestión de Usuarios
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddNew}>
            Añadir Usuario
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo Electrónico</TableCell>
                <TableCell align="center">Rol</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.content?.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">
                    <Chip label={user.role.replace('ROLE_', '')} color={user.role === 'ROLE_ADMIN' ? "primary" : "default"} size="small"/>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(user)}><Edit color="primary" /></IconButton>
                    <IconButton onClick={() => handleDeleteClick(user)}><Delete color="error" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal para Añadir/Editar Usuario */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">{isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</Typography>
          <TextField fullWidth margin="normal" label="Nombre Completo" name="name" value={currentUser.name} onChange={handleInputChange}/>
          <TextField fullWidth margin="normal" label="Correo Electrónico" name="email" type="email" value={currentUser.email} onChange={handleInputChange}/>
          { !isEditing && <TextField fullWidth margin="normal" label="Contraseña" name="password" type="password" value={currentUser.password} onChange={handleInputChange}/>}
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Rol</InputLabel>
            <Select labelId="role-select-label" name="role" value={currentUser.role} label="Rol" onChange={handleInputChange}>
              {/* --- CAMBIO CLAVE 2: Los valores ahora coinciden con el Enum del backend --- */}
              <MenuItem value="ROLE_USER">Usuario (Vendedor)</MenuItem>
              <MenuItem value="ROLE_ADMIN">Administrador</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave}>Guardar</Button>
          </Box>
        </Box>
      </Modal>

      {/* Diálogo de Confirmación para Eliminar */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar al usuario "{userToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}