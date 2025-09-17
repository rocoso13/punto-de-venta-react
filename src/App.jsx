import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { UserProvider } from './context/UserContext';
import { ClientProvider } from './context/ClientContext';
import { SalesHistoryProvider } from './context/SalesHistoryContext';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import POSLayout from './pos/POSLayout';
import Sales from './pos/Sales';
import Inventory from './pos/Inventory';
import Reports from './pos/Reports';
import Users from './pos/Users';
import Clients from './pos/Clients';
import SalesHistory from './pos/SalesHistory';
import CashierCloseout from './pos/CashierCloseout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <ProductProvider>
            <UserProvider>
              <ClientProvider>
                <SalesHistoryProvider>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    <Route path="/pos" element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']} />}>
                      <Route element={<POSLayout />}>
                        <Route index element={<Sales />} />
                        <Route path="sales" element={<Sales />} />
                        <Route path="clients" element={<Clients />} />

                        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                          <Route path="cashier-closeout" element={<CashierCloseout />} />
                          <Route path="sales-history" element={<SalesHistory />} />
                          <Route path="inventory" element={<Inventory />} />
                          <Route path="reports" element={<Reports />} />
                          <Route path="users" element={<Users />} />
                        </Route>
                      </Route>
                    </Route>
                    
                    <Route path="*" element={<Navigate to="/pos" />} />
                  </Routes>
                </SalesHistoryProvider>
              </ClientProvider>
            </UserProvider>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;