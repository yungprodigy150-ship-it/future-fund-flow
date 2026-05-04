import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, Divide, RotateCcw, Equal, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [lastValue, setLastValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (shouldReset) {
      setDisplay('0.');
      setShouldReset(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (lastValue === null) {
      setLastValue(current);
    } else if (operation) {
      const result = calculate(lastValue, current, operation);
      setLastValue(result);
      setDisplay(result.toString());
    }
    
    setOperation(op);
    setEquation(`${current} ${op}`);
    setShouldReset(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  const handleEqual = () => {
    if (lastValue === null || !operation) return;
    
    const current = parseFloat(display);
    const result = calculate(lastValue, current, operation);
    
    setEquation(`${lastValue} ${operation} ${current} =`);
    setDisplay(result.toString());
    setLastValue(null);
    setOperation(null);
    setShouldReset(true);
    
    if (current === 0 && operation === '/') {
      toast.error("Cannot divide by zero");
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setLastValue(null);
    setOperation(null);
    setShouldReset(false);
  };

  const deleteLast = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const buttons = [
    { label: 'C', action: clear, variant: 'outline' as const, className: 'text-destructive hover:bg-destructive/10' },
    { label: 'DEL', action: deleteLast, variant: 'outline' as const, icon: <Delete className="h-4 w-4" /> },
    { label: '/', action: () => handleOperation('/'), variant: 'secondary' as const, icon: <Divide className="h-4 w-4" /> },
    { label: '*', action: () => handleOperation('*'), variant: 'secondary' as const, icon: <X className="h-4 w-4" /> },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '-', action: () => handleOperation('-'), variant: 'secondary' as const, icon: <Minus className="h-4 w-4" /> },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '+', action: () => handleOperation('+'), variant: 'secondary' as const, icon: <Plus className="h-4 w-4" /> },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '=', action: handleEqual, variant: 'default' as const, className: 'row-span-2 h-full bg-primary hover:bg-primary/90', icon: <Equal className="h-5 w-5" /> },
    { label: '0', action: () => handleNumber('0'), className: 'col-span-2' },
    { label: '.', action: handleDecimal },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-[350px] overflow-hidden border-none shadow-2xl bg-card/50 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            Smart Calc
          </CardTitle>
          <CardDescription>Precision in every click</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-right min-h-[100px] flex flex-col justify-end gap-1 shadow-inner">
            <div className="text-sm text-muted-foreground font-mono h-5 overflow-hidden text-ellipsis">
              {equation}
            </div>
            <div className="text-4xl font-bold tracking-tighter overflow-hidden text-ellipsis">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {buttons.map((btn, i) => (
              <Button
                key={i}
                variant={btn.variant || 'ghost'}
                onClick={btn.action}
                className={`h-14 text-lg font-medium rounded-2xl transition-all duration-200 active:scale-95 ${btn.className || ''}`}
              >
                {btn.icon || btn.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}