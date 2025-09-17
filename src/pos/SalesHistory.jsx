import React, { useState, useMemo } from 'react';
import { useSalesHistory } from '../context/SalesHistoryContext';
import { useClients } from '../context/ClientContext'; // 1. Importar contexto de clientes
import { useProducts } from '../context/ProductContext';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Modal, List, ListItem, ListItemText, Divider,
  TextField, InputAdornment
} from '@mui/material';
import { Visibility, Search } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2,
};

export default function SalesHistory() {
  const { sales, fetchSales } = useSalesHistory(); // Obtenemos los datos y la función de refresco
  const { products } = useProducts();
  const { clients } = useClients();
  const [openModal, setOpenModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  console.log("esto trae clientes : ", clients);
  
  const handleRefresh = () => fetchSales();

  // Lógica de filtrado
  const filteredSales = useMemo(() => {
    return sales.filter(sale =>
      sale.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sales, searchTerm]);

  const handleOpenModal = (sale) => {
    setSelectedSale(sale);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSale(null);
  };

  console.log(selectedSale);
  

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Historial de Ventas</Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Buscar por ID de Venta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),
            }}
            sx={{ width: '300px' }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID de Venta</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell align="center">Nº de Artículos</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredSales.map((sale) => {
                const clientName = clients.content.find(c => c.id === sale.clientId)?.name || 'Cliente General';
                return (
                  <TableRow key={sale.id} hover>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                    <TableCell>{clientName}</TableCell> {/* 4. Mostrar nombre del cliente */}
                    <TableCell align="center">{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell align="right">${sale.total.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenModal(sale)}>
                      <Visibility color="primary" />
                    </IconButton>
                  </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal de Detalles de la Venta */}
      {selectedSale && (
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">Detalles de la Venta: {selectedSale.id}</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Fecha: {new Date(selectedSale.date).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cliente: {clients.find(c => c.id === selectedSale.client)?.name || 'Cliente General'}
            </Typography>
            <Divider />
            <List dense sx={{ my: 2 }}>
              {selectedSale.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={`${item.product.name} x${item.quantity}`} 
                    secondary={`Subtotal: $${(item.product.price * item.quantity).toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
            <Typography variant="h5" sx={{ mt: 2, textAlign: 'right' }}>
              Total: ${selectedSale.total.toFixed(2)}
            </Typography>
          </Box>
        </Modal>
      )}
    </Box>
  );
}