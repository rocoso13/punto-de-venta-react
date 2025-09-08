import React, { useState } from 'react';
import { useUsers } from '../context/UserContext';
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
  const { users, updateUserList } = useUsers();
  
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '', role: 'user' });
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentUser({ id: null, name: '', email: '', role: 'user' });
    setOpenModal(true);
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSave = () => {
    let updatedUsers;
    if (isEditing) {
      updatedUsers = users.map(u => u.id === currentUser.id ? currentUser : u);
    } else {
      const newUser = { ...currentUser, id: Date.now() }; // ID simple
      updatedUsers = [...users, newUser];
    }
    updateUserList(updatedUsers);
    handleCloseModal();
  };
  
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    const updatedUsers = users.filter(u => u.id !== userToDelete.id);
    updateUserList(updatedUsers);
    handleCloseConfirmDialog();
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
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell component="th" scope="row">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={user.role}
                      color={user.role === 'admin' ? "primary" : "default"}
                      size="small"
                    />
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
          <Typography variant="h6" component="h2" mb={2}>
            {isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}
          </Typography>
          <TextField fullWidth margin="normal" label="Nombre Completo" name="name" value={currentUser.name} onChange={handleInputChange}/>
          <TextField fullWidth margin="normal" label="Correo Electrónico" name="email" type="email" value={currentUser.email} onChange={handleInputChange}/>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Rol</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={currentUser.role}
              label="Rol"
              onChange={handleInputChange}
            >
              <MenuItem value="user">Usuario (Vendedor)</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>Guardar</Button>
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