export const products = [
    { id: 1, name: 'Café Americano', price: 50, stock: 100, image: 'https://images.unsplash.com/photo-1589396512332-6a75a77227c8?auto=format&fit=crop&w=300' },
    { id: 2, name: 'Café Latte', price: 65, stock: 80, image: 'https://images.unsplash.com/photo-1561882468-91101f2e5f80?auto=format&fit=crop&w=300' },
    { id: 3, name: 'Capuchino', price: 70, stock: 75, image: 'https://images.unsplash.com/photo-1557006021-b1da7ba58b6c?auto=format&fit=crop&w=300' },
    { id: 4, name: 'Té Verde', price: 45, stock: 60, image: 'https://images.unsplash.com/photo-1563822499878-86c00384234e?auto=format&fit=crop&w=300' },
    { id: 5, name: 'Croissant', price: 55, stock: 50, image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=300' },
    { id: 6, name: 'Pastel de Chocolate', price: 80, stock: 5, image: 'https://images.unsplash.com/photo-1606313564200-e85b94de43ee?auto=format&fit=crop&w=300' }, // Bajo stock para probar
    { id: 7, name: 'Jugo de Naranja', price: 60, stock: 40, image: 'https://images.unsplash.com/photo-1613482141553-c5989e831868?auto=format&fit=crop&w=300' },
    { id: 8, name: 'Agua Embotellada', price: 30, stock: 0, image: 'https://images.unsplash.com/photo-1625023005896-26f634b16250?auto=format&fit=crop&w=300' }, // Agotado para probar
  ];
  
  // ... resto del archivo (salesHistory) ...

  // ... array de `products` existente ...

// Agrega este nuevo array de datos de ventas ficticios


export const users = [
    { id: 1, name: 'Administrador Principal', email: 'admin@correo.com', role: 'admin' },
    { id: 2, name: 'Vendedor Turno Mañana', email: 'usuario@correo.com', role: 'user' },
    { id: 3, name: 'Vendedor Turno Tarde', email: 'vendedor2@correo.com', role: 'admin' },
];

export const clients = [
    { id: 1, name: 'Cliente Frecuente 1', email: 'cliente1@correo.com', phone: '555-123-4567' },
    { id: 2, name: 'Cliente Ocasional 2', email: 'cliente2@correo.com', phone: '555-987-6543' },
    { id: 3, name: 'Cliente VIP 3', email: 'clientevip@correo.com', phone: '555-555-5555' },
];

export const salesHistory = [
    { id: 'SALE-001', date: '2025-08-01T10:30:00Z', items: [{ productId: 6, quantity: 2, price: 80 }], total: 155, paymentMethod: 'Tarjeta', clientId: 1 },
    { id: 'SALE-002', date: '2025-08-01T12:45:00Z', items: [{ productId: 5, quantity: 1, price: 80 }], total: 70, paymentMethod: 'Efectivo', clientId: null },
    { id: 'SALE-003', date: '2025-08-02T09:15:00Z', items: [{ productId: 4, quantity: 4, price: 80 }], total: 200, paymentMethod: 'Tarjeta', clientId: 2 },
    { id: 'SALE-004', date: '2025-08-03T14:00:00Z', items: [{ productId: 3, quantity: 3, price: 80 }], total: 110, paymentMethod: 'Efectivo', clientId: 3 },
    { id: 'SALE-005', date: '2025-08-03T18:20:00Z', items: [/*...*/], total: 110, paymentMethod: 'Tarjeta', clientId: 1 },
    { id: 'SALE-006', date: '2025-07-15T11:00:00Z', items: [/*...*/], total: 130, paymentMethod: 'Efectivo', clientId: null },
    { id: 'SALE-007', date: '2025-07-20T16:50:00Z', items: [/*...*/], total: 80, paymentMethod: 'Tarjeta', clientId: 2 },
];
  