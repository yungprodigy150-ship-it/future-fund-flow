import React, { useState, useEffect } from 'react';
import { Plus, History, PiggyBank, Target, Trash2, ArrowUpCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface SavingsEntry {
  id: string;
  amount: number;
  date: string;
  note: string;
}

export default function SavingsTracker() {
  const [entries, setEntries] = useState<SavingsEntry[]>([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [goal, setGoal] = useState(1000);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState('1000');

  useEffect(() => {
    const savedEntries = localStorage.getItem('savings_entries');
    const savedGoal = localStorage.getItem('savings_goal');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedGoal) {
      setGoal(parseFloat(savedGoal));
      setTempGoal(savedGoal);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savings_entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    const newEntry: SavingsEntry = {
      id: crypto.randomUUID(),
      amount: val,
      date: new Date().toLocaleDateString(),
      note: note || 'Regular Savings'
    };

    setEntries([newEntry, ...entries]);
    setAmount('');
    setNote('');
    toast.success(`Saved $${val.toFixed(2)}!`);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    toast.info("Entry deleted");
  };

  const totalSavings = entries.reduce((acc, curr) => acc + curr.amount, 0);
  const progress = Math.min((totalSavings / goal) * 100, 100);

  const saveGoal = () => {
    const val = parseFloat(tempGoal);
    if (!isNaN(val) && val > 0) {
      setGoal(val);
      localStorage.setItem('savings_goal', val.toString());
      setIsEditingGoal(false);
      toast.success("Savings goal updated");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto p-4">
      {/* Overview & Add Section */}
      <div className="space-y-6">
        <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <PiggyBank className="h-6 w-6 text-primary" />
                  Total Savings
                </CardTitle>
                <CardDescription>Your financial progress at a glance</CardDescription>
              </div>
              <div className="text-3xl font-black text-primary">
                ${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" /> Goal: ${goal.toLocaleString()}
                </span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            
            {isEditingGoal ? (
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  value={tempGoal} 
                  onChange={(e) => setTempGoal(e.target.value)}
                  className="h-8"
                />
                <Button size="sm" onClick={saveGoal}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingGoal(false)}>Cancel</Button>
              </div>
            ) : (
              <Button variant="link" size="sm" className="px-0 h-auto" onClick={() => setIsEditingGoal(true)}>
                Edit Savings Goal
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-muted">
          <CardHeader>
            <CardTitle className="text-lg">Add New Savings</CardTitle>
          </CardHeader>
          <form onSubmit={addEntry}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground font-medium">$</span>
                  <Input 
                    id="amount"
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    className="pl-7 h-12 text-lg"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Description (Optional)</Label>
                <Input 
                  id="note"
                  placeholder="e.g. Weekly allowance, Bonus..." 
                  className="h-12"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-12 text-lg font-semibold gap-2">
                <Plus className="h-5 w-5" /> Add to Piggy Bank
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Visual Cue */}
        <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg group">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/03f07f73-f215-4971-8e5b-58cccf7a81cc/savings-piggy-bank-hero-4d3219ba-1777850786247.webp" 
            alt="Savings"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
            <h4 className="text-white font-bold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-400" />
              Keep Growing
            </h4>
            <p className="text-white/80 text-xs">Small steps lead to big changes.</p>
          </div>
        </div>
      </div>

      {/* History Section */}
      <Card className="flex flex-col h-full shadow-lg overflow-hidden border-muted">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Savings History
          </CardTitle>
          <CardDescription>Your recent contributions</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-[400px] md:h-[600px] p-4">
            <AnimatePresence initial={false}>
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                  <ArrowUpCircle className="h-12 w-12 mb-2" />
                  <p>No entries yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-primary">${entry.amount.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">{entry.date} • {entry.note}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}