import React from 'react';
import { salesHistory, products } from '../mockData';
import { 
  Grid, Paper, Typography, Card, CardContent, Box, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, Button 
} from '@mui/material';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { AttachMoney, ShoppingCart, TrendingUp, MoreVert } from '@mui/icons-material';

// --- Componentes Auxiliares y Datos (sin cambios) ---
const SummaryCard = ({ title, value, icon, color }) => (
  <Card elevation={6}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ bgcolor: color, borderRadius: '50%', p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
          {icon}
        </Box>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">{title}</Typography>
          <Typography variant="h5" component="div" fontWeight="bold">{value}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// --- Componente Principal de Reportes (con ajustes de diseño) ---

export default function Reports() {
  // --- Lógica de cálculo de datos (sin cambios) ---
  const totalRevenue = salesHistory.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = salesHistory.length;
  const averageOrderValue = totalRevenue / totalOrders;

  const salesByDay = salesHistory.reduce((acc, sale) => {
    const date = new Date(sale.date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
    if (!acc[date]) { acc[date] = 0; }
    acc[date] += sale.total;
    return acc;
  }, {});
  const barChartData = Object.keys(salesByDay).map(date => ({
    date, Ventas: salesByDay[date],
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  const productSales = salesHistory
    .flatMap(sale => sale.items)
    .reduce((acc, item) => {
      if (!acc[item.productId]) { acc[item.productId] = 0; }
      acc[item.productId] += item.quantity;
      return acc;
    }, {});
  
  const pieChartData = Object.keys(productSales).map(productId => ({
    name: products.find(p => p.id === parseInt(productId))?.name || 'Desconocido',
    value: productSales[productId],
  })).sort((a, b) => b.value - a.value).slice(0, 5);
  
  const totalPieValue = pieChartData.reduce((sum, entry) => sum + entry.value, 0);

  const recentSales = [...salesHistory]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Box>
      {/* Tarjetas de Resumen (sin cambios en su lógica) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard title="Ventas Totales" value={`$${totalRevenue.toFixed(2)}`} icon={<AttachMoney sx={{ color: '#fff' }} />} color="success.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard title="Órdenes Totales" value={totalOrders} icon={<ShoppingCart sx={{ color: '#fff' }} />} color="info.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard title="Valor Promedio por Orden" value={`$${averageOrderValue.toFixed(2)}`} icon={<TrendingUp sx={{ color: '#fff' }} />} color="primary.main" />
        </Grid>
      </Grid>
      
      {/* Fila con los dos gráficos principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Barras (AJUSTADO) */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3, height: '450px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Ventas de la Semana</Typography>
              <Button size="small">Últimos 7 días</Button>
            </Box>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                {/* AJUSTE: Solo líneas de cuadrícula horizontales */}
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(224, 224, 224, 0.2)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#e0e0e0', fontSize: 12 }} />
                <YAxis tick={{ fill: '#e0e0e0' }} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ backgroundColor: '#232946', border: '1px solid #333' }} />
                {/* AJUSTE: Leyenda en la parte superior */}
                <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: '20px' }}/>
                {/* AJUSTE: Barras redondeadas en la parte superior */}
                <Bar dataKey="Ventas" fill="#007bff" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Dona con Leyenda Personalizada (AJUSTADO) */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, height: '450px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Productos Populares</Typography>
              <Button size="small">Este Mes</Button>
            </Box>
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                {/* AJUSTE: innerRadius convierte el Pie en un Donut */}
                <Pie 
                  data={pieChartData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#232946', border: '1px solid #333' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* AJUSTE: Leyenda personalizada debajo del gráfico */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              {pieChartData.map((entry, index) => (
                <Box key={`legend-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: COLORS[index % COLORS.length], borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {entry.name} ({(entry.value / totalPieValue * 100).toFixed(0)}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla de Ventas Recientes (sin cambios) */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2} sx={{ px: 1 }}>Ventas Recientes</Typography>
            <TableContainer sx={{ maxHeight: '380px' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID de Venta</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="center">Nº de Artículos</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id} hover>
                      <TableCell component="th" scope="row">{sale.id}</TableCell>
                      <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                      <TableCell align="center">{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                      <TableCell align="right">${sale.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}