import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PiggyBank, Target, TrendingUp, Calculator, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';

const quickActions = [
  { icon: <Wallet className="h-5 w-5" />, label: 'My Safes', to: '/safes', desc: 'View all your savings safes' },
  { icon: <TrendingUp className="h-5 w-5" />, label: 'Savings Tracker', to: '/savings', desc: 'Track your progress' },
  { icon: <Calculator className="h-5 w-5" />, label: 'Calculator', to: '/calculator', desc: 'Financial calculator' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your financial activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-none bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-sm font-medium">Total Saved</span>
                <PiggyBank className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-black">$0.00</div>
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-blue-500/10 to-blue-500/5 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-sm font-medium">Active Safes</span>
                <Wallet className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-black">0</div>
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-green-500/10 to-green-500/5 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-sm font-medium">Goals Met</span>
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-black">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/40 cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-primary">{action.icon}</span>
                    {action.label}
                  </CardTitle>
                  <CardDescription>{action.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="ghost" size="sm" className="gap-1 group-hover:gap-2 transition-all px-0" asChild>
                    <Link to={action.to}>
                      Go <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
