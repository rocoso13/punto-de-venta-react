import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell, Chip,
  TableContainer, TableHead, TableRow, IconButton, Modal, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
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

export default function Inventory() {
  const { products, updateProductList } = useProducts();
  
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', price: '', stock: '', image: '' });
  const [productToDelete, setProductToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentProduct({ id: null, name: '', price: '', stock: '', image: '' });
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSave = () => {
    let updatedProducts;
    // Asegurarse de que el stock y el precio sean números
    const productData = {
        ...currentProduct,
        price: parseFloat(currentProduct.price) || 0,
        stock: parseInt(currentProduct.stock, 10) || 0,
    };

    if (isEditing) {
      updatedProducts = products.map(p => p.id === productData.id ? productData : p);
    } else {
      const newProduct = { ...productData, id: Date.now() };
      updatedProducts = [...products, newProduct];
    }
    updateProductList(updatedProducts);
    handleCloseModal();
  };
  
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = () => {
    const updatedProducts = products.filter(p => p.id !== productToDelete.id);
    updateProductList(updatedProducts);
    handleCloseConfirmDialog();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Gestión de Inventario
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddNew}>
            Añadir Producto
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre del Producto</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ height: 50, width: 50, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">{product.name}</TableCell>
                  <TableCell align="right">${parseFloat(product.price).toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={product.stock}
                      color={product.stock === 0 ? "error" : product.stock <= 10 ? "warning" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(product)}><Edit color="primary" /></IconButton>
                    <IconButton onClick={() => handleDeleteClick(product)}><Delete color="error" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" mb={2}>
            {isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}
          </Typography>
          <TextField fullWidth margin="normal" label="Nombre del Producto" name="name" value={currentProduct.name} onChange={handleInputChange}/>
          <TextField fullWidth margin="normal" label="Precio" name="price" type="number" value={currentProduct.price} onChange={handleInputChange}/>
          <TextField fullWidth margin="normal" label="Stock" name="stock" type="number" value={currentProduct.stock} onChange={handleInputChange}/>
          <TextField fullWidth margin="normal" label="URL de la Imagen" name="image" value={currentProduct.image} onChange={handleInputChange}/>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>Guardar</Button>
          </Box>
        </Box>
      </Modal>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar el producto "{productToDelete?.name}"? Esta acción no se puede deshacer.
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