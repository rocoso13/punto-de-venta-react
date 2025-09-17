import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useSalesHistory } from '../context/SalesHistoryContext';
import { useClients } from '../context/ClientContext';
import apiClient from '../api/axiosConfig';
import {
    Box, Grid, Card, CardMedia, CardContent, Typography, CardActions, Button,
    Paper, List, ListItem, ListItemText, Divider, IconButton, Modal, Fade,
    Backdrop, Chip, TextField, InputAdornment, Autocomplete  // 1. AÑADIMOS TextField y InputAdornment
} from '@mui/material';
import {
    AddCircleOutline, RemoveCircleOutline, Delete, Search, Cancel // 2. AÑADIMOS el ícono de Search
} from '@mui/icons-material';

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, borderRadius: 2,
};

export default function Sales() {
    const { products, fetchProducts } = useProducts(); // Obtenemos fetchProducts
    const { fetchSales } = useSalesHistory();
    const { clients } = useClients();
    const [cart, setCart] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    // 3. AÑADIMOS EL ESTADO PARA LA BÚSQUEDA
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(''); // Estado para guardar el método de pago
    const [selectedClient, setSelectedClient] = useState(null); // 4. Nuevo estado para el cliente seleccionado

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // 4. AÑADIMOS LA LÓGICA DE FILTRADO
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (productToAdd) => {
        const productInStock = products.find(p => p.id === productToAdd.id);
        const itemInCart = cart.find(item => item.product.id === productToAdd.id);
        const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;

        if (productInStock && productInStock.stock > currentQuantityInCart) {
            if (itemInCart) {
                setCart(cart.map(item =>
                    item.product.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
                ));
            } else {
                setCart([...cart, { product: productToAdd, quantity: 1 }]);
            }
        } else {
            alert(`¡No hay suficiente stock para "${productToAdd.name}"!`);
        }
    };

    const adjustQuantity = (productId, amount) => {
        const itemInCart = cart.find(item => item.product.id === productId);
        const productInStock = products.find(p => p.id === productId);

        if (amount > 0 && itemInCart.quantity + amount > productInStock.stock) {
            alert(`Solo quedan ${productInStock.stock} unidades de "${productInStock.name}".`);
            return;
        }

        setCart(cart.map(item =>
            item.product.id === productId ? { ...item, quantity: item.quantity + amount } : item
        ).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const clearCart = () => setCart([]);

    const handleOpenModal = (method) => {
        setPaymentMethod(method); // Guardamos el método de pago seleccionado
        setOpenModal(true);
    };
    const handleCloseModal = () => setOpenModal(false);

    const handleConfirmSale = async () => {
        const saleRequestDto = {
            clientId: selectedClient ? selectedClient.id : null,
            paymentMethod: paymentMethod,
            items: cart.map(cartItem => ({
                productId: cartItem.product.id,
                quantity: cartItem.quantity
            })),
        };

        try {
            await apiClient.post('/sales', saleRequestDto);
            alert(`Venta para "${selectedClient ? selectedClient.name : 'Cliente General'}" confirmada.`);

            // Refrescamos los datos después de la venta
            fetchProducts();
            fetchSales();

            clearCart();
            setSelectedClient(null);
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear la venta:", error);
            alert("Error al procesar la venta: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {/* 5. REEMPLAZAMOS EL ENCABEZADO DE "PRODUCTOS" CON UNO QUE INCLUYE LA BÚSQUEDA */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ color: 'text.primary' }}>
                            Productos
                        </Typography>
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: '300px' }}
                        />
                    </Box>
                    <Grid container spacing={2}>
                        {/* 6. USAMOS LA LISTA FILTRADA PARA MOSTRAR LOS PRODUCTOS */}
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Grid item key={product.id} xs={12} sm={6} md={4}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: product.stock === 0 ? 0.6 : 1 }}>
                                        <CardMedia component="img" height="160" image={product.image} alt={product.name} />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h6" component="div">{product.name}</Typography>
                                            <Typography variant="subtitle1" color="primary.light" sx={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</Typography>
                                            <Chip
                                                label={`Stock: ${product.stock}`}
                                                color={product.stock === 0 ? "error" : product.stock <= 10 ? "warning" : "default"}
                                                size="small"
                                                sx={{ mt: 1 }}
                                            />
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock === 0}
                                            >
                                                {product.stock === 0 ? 'Agotado' : 'Agregar'}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                                    No se encontraron productos con ese nombre.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                <Grid item xs={12} md={4} sx={{ position: 'sticky', top: '88px', alignSelf: 'flex-start' }}>
                    <Paper elevation={6} sx={{ p: 3, height: 'calc(100vh - 88px)', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom>Carrito</Typography>
                        <Box sx={{ mb: 2 }}>
                            {selectedClient ? (
                                <Paper variant="outlined" sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2">Cliente: <b>{selectedClient.name}</b></Typography>
                                    <IconButton size="small" onClick={() => setSelectedClient(null)}>
                                        <Cancel />
                                    </IconButton>
                                </Paper>
                            ) : (
                                <Autocomplete
                                    options={clients}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event, newValue) => {
                                        setSelectedClient(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Buscar y asignar cliente" size="small" />}
                                    size="small"
                                />
                            )}
                        </Box>
                        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            {cart.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                                    No hay productos en el carrito.
                                </Typography>
                            ) : (
                                cart.map(({ product, quantity }) => (
                                    <ListItem
                                        key={product.id}
                                        disablePadding
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            py: 1
                                        }}
                                    >
                                        <ListItemText
                                            primary={`${product.name} (x${quantity})`}
                                            secondary={`$${(product.price * quantity).toFixed(2)}`}
                                            primaryTypographyProps={{ color: 'text.primary', fontWeight: 'bold' }}
                                            secondaryTypographyProps={{ color: 'text.secondary' }}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton size="small" onClick={() => adjustQuantity(product.id, -1)}>
                                                <RemoveCircleOutline fontSize="small" />
                                            </IconButton>
                                            <Typography sx={{ mx: 0.5, minWidth: '20px', textAlign: 'center' }}>{quantity}</Typography>
                                            <IconButton size="small" onClick={() => adjustQuantity(product.id, 1)}>
                                                <AddCircleOutline fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => removeFromCart(product.id)}
                                                sx={{ ml: 1 }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                ))
                            )}
                        </List>
                        <Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6">Total: <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>${total.toFixed(2)}</Box></Typography>
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                                <Grid item xs={6}>
                                    <Button variant="contained" color="success" fullWidth disabled={cart.length === 0} onClick={() => handleOpenModal('Efectivo')}>
                                        Cobrar Efectivo
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" color="primary" fullWidth disabled={cart.length === 0} onClick={() => handleOpenModal('Tarjeta')}>
                                        Cobrar Tarjeta
                                    </Button>
                                </Grid>
                            </Grid>
                            <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }} disabled={cart.length === 0} onClick={clearCart}>Vaciar Carrito</Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                <Fade in={openModal}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" component="h2">Confirmar Venta ({paymentMethod})</Typography>
                        <List dense sx={{ my: 2 }}>
                            {cart.map(({ product, quantity }) => (
                                <ListItem key={product.id}>
                                    <ListItemText primary={`${product.name} x${quantity}`} secondary={`$${(product.price * quantity).toFixed(2)}`} />
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <Typography variant="h5" sx={{ mt: 2, textAlign: 'right' }}>Total: ${total.toFixed(2)}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Cancelar</Button>
                            <Button variant="contained" color="success" onClick={handleConfirmSale}>Confirmar y Cobrar</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}