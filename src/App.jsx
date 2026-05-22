import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import TransactionForm from './pages/TransactionForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publika routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Skyddade routes — kräver inloggning */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/add-transaction" element={<ProtectedRoute><TransactionForm /></ProtectedRoute>} />
        <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;