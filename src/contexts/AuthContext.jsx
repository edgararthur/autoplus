import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the auth context
const AuthContext = createContext();

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin', 'dealer', or 'buyer'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('autoparts_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setUserType(parsedUser.userType);
      } catch (error) {
        // Log error to a proper error monitoring service in production
        setError('Failed to parse stored user data');
        localStorage.removeItem('autoparts_user');
      }
    }
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would call your API
  const login = async (email, password, type) => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { 
          success: false, 
          error: 'Email and password are required' 
        };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate different user types for demonstration
      let userData;
      
      if (type === 'admin') {
        userData = {
          id: 'admin-1',
          email: email,
          name: 'Admin User',
          userType: 'admin',
          permissions: ['all'],
        };
      } else if (type === 'dealer') {
        userData = {
          id: 'dealer-1',
          email: email,
          name: 'Dealer Company',
          userType: 'dealer',
          companyName: 'Auto Parts Plus',
          location: 'Chicago, IL',
        };
      } else {
        userData = {
          id: 'buyer-1',
          email: email,
          name: 'John Smith',
          userType: 'buyer',
        };
      }
      
      setCurrentUser(userData);
      setUserType(userData.userType);
      localStorage.setItem('autoparts_user', JSON.stringify(userData));
      
      // Redirect to appropriate dashboard
      if (type === 'admin') {
        navigate('/admin/dashboard');
      } else if (type === 'dealer') {
        navigate('/dealer/dashboard');
      } else {
        navigate('/shop');
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to log in' 
      };
    }
  };

  // Mock signup function
  const register = async (userData, type) => {
    try {
      // Validate inputs
      if (!userData.email || !userData.name) {
        return { 
          success: false, 
          error: 'Email and name are required' 
        };
      }
      
      if (type === 'dealer' && (!userData.companyName || !userData.location)) {
        return { 
          success: false, 
          error: 'Company name and location are required for dealer accounts' 
        };
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user object based on type
      const newUser = {
        id: `${type}-` + Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        userType: type,
        createdAt: new Date().toISOString(),
      };
      
      if (type === 'dealer') {
        newUser.companyName = userData.companyName;
        newUser.location = userData.location;
      }
      
      setCurrentUser(newUser);
      setUserType(type);
      localStorage.setItem('autoparts_user', JSON.stringify(newUser));
      
      // Redirect to appropriate onboarding or dashboard
      if (type === 'dealer') {
        navigate('/dealer/dashboard');
      } else {
        navigate('/shop');
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to register' 
      };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('autoparts_user');
    navigate('/');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser?.userType === role;
  };

  const value = {
    currentUser,
    userType,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
