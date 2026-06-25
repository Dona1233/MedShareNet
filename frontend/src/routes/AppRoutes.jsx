import Landing from '../pages/Landing';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DonorDashboard from '../pages/donor/DonorDashboard';
import AddResource from '../pages/donor/AddResource';
import MyDonations from '../pages/donor/MyDonations';
import BeneficiaryDashboard from '../pages/beneficiary/BeneficiaryDashboard';
import BrowseResources from '../pages/beneficiary/BrowseResources';
import MyRequests from '../pages/beneficiary/MyRequests';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageResources from '../pages/admin/ManageResources';
import ManageRequests from '../pages/admin/ManageRequests';
import NotFound from '../pages/shared/NotFound';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}`} />} />

        <Route path="/donor" element={<ProtectedRoute allowedRoles={['donor']}><DonorDashboard /></ProtectedRoute>} />
        <Route path="/donor/add-resource" element={<ProtectedRoute allowedRoles={['donor']}><AddResource /></ProtectedRoute>} />
        <Route path="/donor/my-donations" element={<ProtectedRoute allowedRoles={['donor']}><MyDonations /></ProtectedRoute>} />

        <Route path="/beneficiary" element={<ProtectedRoute allowedRoles={['beneficiary']}><BeneficiaryDashboard /></ProtectedRoute>} />
        <Route path="/beneficiary/browse" element={<ProtectedRoute allowedRoles={['beneficiary']}><BrowseResources /></ProtectedRoute>} />
        <Route path="/beneficiary/my-requests" element={<ProtectedRoute allowedRoles={['beneficiary']}><MyRequests /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/resources" element={<ProtectedRoute allowedRoles={['admin']}><ManageResources /></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['admin']}><ManageRequests /></ProtectedRoute>} />

        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;