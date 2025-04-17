import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from 'autoplus-shared';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DealerManagement from './pages/admin/DealerManagement';
import DealerApprovals from './pages/admin/DealerApprovals';
import ProductManagement from './pages/admin/ProductManagement';
import ProductModeration from './pages/admin/ProductModeration';
import SupportTickets from './pages/admin/SupportTickets';
import PlatformAnalytics from './pages/admin/PlatformAnalytics';

// Common Components
import LoadingScreen from './components/common/LoadingScreen';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          checkUserRole(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      setIsAdmin(data.role === 'ADMIN');
      setLoading(false);
    } catch (error) {
      console.error('Error checking user role:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={!session ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Admin Routes */}
        <Route path="/dashboard" 
          element={session && isAdmin ? <AdminDashboard /> : <Navigate to={session ? "/unauthorized" : "/login"} />} 
        />
        <Route path="/users" 
          element={session && isAdmin ? <UserManagement /> : <Navigate to={session ? "/unauthorized" : "/login"} />} 
        />
        <Route path="/dealers" 
          element={session && isAdmin ? <DealerManagement /> : <Navigate to={session ? "/unauthorized" : "/login"} />} 
        />
        <Route path="/dealer-approvals" 
          element={session && isAdmin ? <DealerApprovals /> : <Navigate to={session ? "/unauthorized" : "/login"} />} 
        />
        <Route path="/products" 
          element={session && isAdmin ? <ProductManagement /> : <Navigate to={session ? "/unauthorized" : "/login"} />} 
        />
        <Route path="/product-moderation" 
          element={session && isAdmin ? <ProductModeration /> : <Navigate to={session ? "/unauthorized" : "/login"} />} 
        />
        <Route path="/support-tickets" 
          element={session && isAdmin ? <SupportTickets /> : <Navigate to={session ? "/unauthorized" : "/login"} />} 
        />
        <Route path="/analytics" 
          element={session && isAdmin ? <PlatformAnalytics /> : <Navigate to={session ? "/unauthorized" : "/login"} />} 
        />
        
        {/* Fallback Route */}
        <Route path="/" element={<Navigate to={session && isAdmin ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App; 