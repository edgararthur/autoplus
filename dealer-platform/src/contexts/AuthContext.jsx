import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserService, supabase } from 'autoplus-shared';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDealer, setIsDealer] = useState(false);
  const [dealerInfo, setDealerInfo] = useState(null);

  // Function to fetch dealer information
  const fetchDealerInfo = async (userId) => {
    try {
      // First check if the user has DEALER role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // If not a dealer, don't proceed
      if (profileData.role !== 'DEALER') {
        setIsDealer(false);
        return { success: false, error: 'User is not a dealer' };
      }
      
      setIsDealer(true);
      
      // Get dealer-specific information
      const { data: dealerData, error: dealerError } = await supabase
        .from('dealers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (dealerError) throw dealerError;
      
      setDealerInfo(dealerData);
      return { success: true, dealerInfo: dealerData };
    } catch (err) {
      console.error('Error fetching dealer info:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    // Get initial session
    const checkUser = async () => {
      try {
        const result = await UserService.getCurrentUser();
        if (result.success) {
          setCurrentUser(result.user);
          // If user exists, check dealer info
          await fetchDealerInfo(result.user.id);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          try {
            const result = await UserService.getCurrentUser();
            if (result.success) {
              setCurrentUser(result.user);
              // If user exists, check dealer info
              await fetchDealerInfo(result.user.id);
            }
          } catch (err) {
            console.error('Error on auth state change:', err);
          }
        } else {
          setCurrentUser(null);
          setIsDealer(false);
          setDealerInfo(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Login with email/password
  const login = async (email, password) => {
    setError('');
    try {
      const result = await UserService.loginUser(email, password);
      
      if (result.success) {
        setCurrentUser(result.user);
        
        // Check if the user is a dealer
        const dealerResult = await fetchDealerInfo(result.user.id);
        
        if (!dealerResult.success || !isDealer) {
          await logout(); // Log them out if they're not a dealer
          return { 
            success: false, 
            error: "Access denied. This platform is for dealers only." 
          };
        }
        
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const message = err.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Register new user
  const register = async (userData) => {
    setError('');
    try {
      // Make sure the role is set to DEALER
      userData.role = 'DEALER';
      
      const result = await UserService.registerUser(userData);
      
      if (result.success) {
        setCurrentUser(result.user);
        
        // Fetch dealer info for the newly registered user
        await fetchDealerInfo(result.user.id);
        
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = async () => {
    setError('');
    try {
      const result = await UserService.logoutUser();
      
      if (result.success) {
        setCurrentUser(null);
        setIsDealer(false);
        setDealerInfo(null);
      }
      return result;
    } catch (err) {
      const message = err.message || 'Logout failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setError('');
    try {
      const result = await UserService.resetPassword(email);
      return result;
    } catch (err) {
      const message = err.message || 'Password reset failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    setError('');
    try {
      const result = await UserService.updateProfile(currentUser.id, profileData);
      
      if (result.success) {
        setCurrentUser({
          ...currentUser,
          profile: result.profile
        });
        
        // If updating dealer specific info, refresh dealer info
        if (profileData.company_name || profileData.location) {
          await fetchDealerInfo(currentUser.id);
        }
      }
      return result;
    } catch (err) {
      const message = err.message || 'Profile update failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    isDealer,
    dealerInfo,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    fetchDealerInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 