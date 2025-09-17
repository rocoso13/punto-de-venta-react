import React, { useState } from 'react';
import { useClients } from '../context/ClientContext';
import { useSalesHistory } from '../context/SalesHistoryContext'; // 1. Importar historial de ventas
import apiClient from '../api/axiosConfig';

import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Modal, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { History } from '@mui/icons-material';
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

export default function Clients() {
    const { clients, updateClientList, fetchClients } = useClients();
    const { sales } = useSalesHistory(); // 2. Obtener las ventas
    const [openModal, setOpenModal] = useState(false);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [selectedClientHistory, setSelectedClientHistory] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [currentClient, setCurrentClient] = useState({ id: null, name: '', email: '', phone: '' });
    const [clientToDelete, setClientToDelete] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleAddNew = () => {
        setIsEditing(false);
        setCurrentClient({ id: null, name: '', email: '', phone: '' });
        setOpenModal(true);
    };

    const handleEdit = (client) => {
        setIsEditing(true);
        setCurrentClient(client);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                // LLAMADA A LA API PARA ACTUALIZAR
                await apiClient.put(`/clients/${currentClient.id}`, currentClient);
            } else {
                // LLAMADA A LA API PARA CREAR
                await apiClient.post('/clients', currentClient);
            }
            fetchClients(); // Refresca la lista de clientes
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar el cliente:", error);
            alert("No se pudo guardar el cliente.");
        }
    };

    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setClientToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            // LLAMADA A LA API PARA ELIMINAR
            await apiClient.delete(`/clients/${clientToDelete.id}`);
            fetchClients(); // Refresca la lista
            handleCloseConfirmDialog();
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
            alert("No se pudo eliminar el cliente.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentClient({ ...currentClient, [name]: value });
    };

    const handleOpenHistory = (client) => {
        const clientSales = sales.filter(sale => sale.clientId === client.id);
        setSelectedClientHistory({ ...client, sales: clientSales });
        setOpenHistoryModal(true);
    };

    const handleCloseHistoryModal = () => {
        setOpenHistoryModal(false);
    };

    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ color: 'text.primary' }}>
                        Gestión de Clientes
                    </Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleAddNew}>
                        Añadir Cliente
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Correo Electrónico</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id} hover>
                                    <TableCell component="th" scope="row">{client.name}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.phone}</TableCell>

                                    <TableCell align="center">
                                        {/* 3. NUEVO BOTÓN para ver el historial */}
                                        <IconButton onClick={() => handleOpenHistory(client)}><History color="info" /></IconButton>
                                        <IconButton onClick={() => handleEdit(client)}><Edit color="primary" /></IconButton>
                                        <IconButton onClick={() => handleDeleteClick(client)}><Delete color="error" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Modal para Añadir/Editar Cliente */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" mb={2}>
                        {isEditing ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}
                    </Typography>
                    <TextField fullWidth margin="normal" label="Nombre Completo" name="name" value={currentClient.name} onChange={handleInputChange} />
                    <TextField fullWidth margin="normal" label="Correo Electrónico" name="email" type="email" value={currentClient.email} onChange={handleInputChange} />
                    <TextField fullWidth margin="normal" label="Teléfono" name="phone" value={currentClient.phone} onChange={handleInputChange} />
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button variant="contained" color="primary" onClick={handleSave}>Guardar</Button>
                    </Box>
                </Box>
            </Modal>
            {selectedClientHistory && (
                <Modal open={openHistoryModal} onClose={handleCloseHistoryModal}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6">Historial de Compras</Typography>
                        <Typography variant="body1" color="text.secondary" mb={2}>
                            {selectedClientHistory.name}
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID Venta</TableCell>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedClientHistory.sales.length > 0 ? (
                                        selectedClientHistory.sales.map(sale => (
                                            <TableRow key={sale.id}>
                                                <TableCell>{sale.id}</TableCell>
                                                <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                                <TableCell align="right">${sale.total.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">Este cliente no tiene compras registradas.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Modal>
            )}

            {/* Diálogo de Confirmación para Eliminar */}
            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que quieres eliminar al cliente "{clientToDelete?.name}"?
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