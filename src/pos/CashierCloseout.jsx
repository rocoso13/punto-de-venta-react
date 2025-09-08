import React, { useState } from 'react';
import { useSalesHistory } from '../context/SalesHistoryContext';
import { Box, Paper, Typography, Button, Grid, Divider, List, ListItem, ListItemText, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';

export default function CashierCloseout() {
  const { sales } = useSalesHistory();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [report, setReport] = useState(null);

  const handleGenerateReport = () => {
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startOfDay && saleDate <= endOfDay;
    });

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = filteredSales.length;
    const cashSales = filteredSales
      .filter(s => s.paymentMethod === 'Efectivo')
      .reduce((sum, sale) => sum + sale.total, 0);
    const cardSales = filteredSales
      .filter(s => s.paymentMethod === 'Tarjeta')
      .reduce((sum, sale) => sum + sale.total, 0);

    setReport({
      totalRevenue,
      totalOrders,
      cashSales,
      cardSales,
      period: `${startOfDay.toLocaleDateString()} - ${endOfDay.toLocaleDateString()}`
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" mb={2}>Corte de Caja</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Fecha de Inicio"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Fecha de Fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="contained" fullWidth size="large" onClick={handleGenerateReport} sx={{ height: '56px' }}>
                Generar Reporte
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {report && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Reporte de Cierre</Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              Período: {report.period}
            </Typography>
            <Divider />
            <List>
              <ListItem>
                <ListItemText primary="Ventas Totales" />
                <Typography variant="h6">${report.totalRevenue.toFixed(2)}</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Número de Órdenes" />
                <Typography variant="h6">{report.totalOrders}</Typography>
              </ListItem>
              <Divider sx={{ my: 1 }} component="li" />
              <ListItem>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Desglose por Método de Pago</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Ingresos en Efectivo" />
                <Typography variant="body1">${report.cashSales.toFixed(2)}</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Ingresos con Tarjeta" />
                <Typography variant="body1">${report.cardSales.toFixed(2)}</Typography>
              </ListItem>
            </List>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
}