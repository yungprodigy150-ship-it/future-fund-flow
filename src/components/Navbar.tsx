import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PiggyBank, LayoutDashboard, Wallet, Calculator, Moon, Sun, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface NavbarProps {
  toggleTheme: () => void;
  isDark: boolean;
}

export default function Navbar({ toggleTheme, isDark }: NavbarProps) {
  const { isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Dashboard' },
        { to: '/safes', icon: <Wallet className="h-4 w-4" />, label: 'Safes' },
        { to: '/calculator', icon: <Calculator className="h-4 w-4" />, label: 'Calculator' },
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <PiggyBank className="h-6 w-6 text-primary" />
          <span>FinSmart</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Button
              key={link.to}
              variant={location.pathname === link.to ? 'secondary' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to={link.to} className="flex items-center gap-2">
                {link.icon}
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile" className="flex items-center gap-1">
                  <User className="h-4 w-4" /> Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
