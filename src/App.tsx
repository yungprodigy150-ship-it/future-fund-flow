import React, { useState } from 'react';
import { Calculator as CalcIcon, Wallet, Sun, Moon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import Calculator from './components/Calculator';
import SavingsTracker from './components/SavingsTracker';

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <Toaster position="top-center" richColors />
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/03f07f73-f215-4971-8e5b-58cccf7a81cc/financial-growth-abstract-b1904e7f-1777850789240.webp" 
          alt="" 
          className="w-full h-full object-cover blur-3xl"
        />
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FinSmart</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Financial Companion</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative">
        <Tabs defaultValue="savings" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="h-14 p-1 bg-muted/50 rounded-2xl shadow-inner w-full max-w-md">
              <TabsTrigger 
                value="savings" 
                className="flex-1 h-12 rounded-xl text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all gap-2"
              >
                <Wallet className="h-5 w-5" />
                Savings
              </TabsTrigger>
              <TabsTrigger 
                value="calculator" 
                className="flex-1 h-12 rounded-xl text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all gap-2"
              >
                <CalcIcon className="h-5 w-5" />
                Calculator
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="savings" className="mt-0 focus-visible:outline-none">
            <SavingsTracker />
          </TabsContent>
          
          <TabsContent value="calculator" className="mt-0 focus-visible:outline-none">
            <Calculator />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-12 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} FinSmart App. Build your future today.</p>
      </footer>
    </div>
  );
}

export default App;