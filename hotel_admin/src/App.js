import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import HotelDetails from 'views/admin/hotels/detail.js';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Public routes */}
        <Route path="auth/*" element={<AuthLayout />} />

        {/* Protected routes */}
        <Route
          path="admin/*"
          element={
            <PrivateRoute>
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </PrivateRoute>
          }
        >
          <Route path="hotels/:hotelId" element={<HotelDetails />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/admin/default" replace />} />
      </Routes>
    </ChakraProvider>
  );
}
