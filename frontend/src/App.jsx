import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing'; // <--- Import Landing
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

// Redirect logged-in users away from Landing/Login pages
const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (!loading && user) return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            
            {/* Public Landing Page */}
            <Route index element={
                <PublicRoute><Landing /></PublicRoute>
            } />

            <Route path="login" element={
                <PublicRoute><Login /></PublicRoute>
            } />
            
            <Route path="register" element={
                <PublicRoute><Register /></PublicRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="projects/create" element={
                <ProtectedRoute><CreateProject /></ProtectedRoute>
            } />
            <Route path="projects/:id" element={
                <ProtectedRoute><ProjectDetail /></ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;