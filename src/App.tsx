import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen';
import GlobalErrorBoundary from './components/ErrorBoundary';
import { supabase } from './lib/supabaseClient';

// Core component static imports to prevent runtime dynamic import errors
// Critical routes are directly imported to avoid chunk loading issues after external redirects
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ProfilePage from './components/Auth/ProfilePage';
import Dashboard from './components/Dashboard';
import SafesDashboard from './components/SafesDashboard';
import Calculator from './components/Calculator';
import LandingPage from './components/LandingPage';
import PaymentStatusPage from './components/PaymentStatusPage';
import SavingsTracker from './components/SavingsTracker';
import PaystackReturn from './components/PaystackReturn';

// Optimized Loading component for auth states
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, initialized } = useAuth();
  
  if (!initialized) return <PageLoader />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, initialized } = useAuth();
  
  if (!initialized) return <PageLoader />;
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Auth Listener Component to handle session changes
const AuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      }
      
      if (event === 'SIGNED_IN') {
        const hash = window.location.hash;
        if (hash.includes('type=signup') || hash.includes('type=invite')) {
          navigate('/dashboard');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

function AppContent() {
  const [isDark, setIsDark] = useState(false);
  const { initialized } = useAuth();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newState = !prev;
      if (newState) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newState;
    });
  }, []);

  const themeClass = useMemo(() => 
    `min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-950'}`
  , [isDark]);

  // HIGH PRIORITY ISOLATION FOR PAYSTACK RETURN
  // This bypasses the initialization splash screen and other complex logic for the return route
  if (window.location.pathname === '/paystack-return') {
    return (
      <div className={themeClass}>
        <main className="relative min-h-[calc(100vh-64px)] flex flex-col">
          <PaystackReturn />
        </main>
      </div>
    );
  }

  if (!initialized) {
    return <SplashScreen />;
  }

  return (
    <div className={themeClass}>
      <Toaster position="top-center" richColors closeButton />
      
      <AuthListener />
      
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />

      <main className="relative min-h-[calc(100vh-64px)] flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupForm /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/safes" element={<ProtectedRoute><SafesDashboard /></ProtectedRoute>} />
          <Route path="/savings" element={<ProtectedRoute><SavingsTracker /></ProtectedRoute>} />
          <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/payment-status" element={<ProtectedRoute><PaymentStatusPage /></ProtectedRoute>} />
          <Route path="/paystack-return" element={<PaystackReturn />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="py-12 text-center text-muted-foreground text-sm border-t mt-auto">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} FinSmart App. Secure Financial Planning.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}

export default App;