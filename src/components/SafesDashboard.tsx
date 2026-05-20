import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, PlusCircle, Vault } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Safe {
  id: string;
  name: string;
  target: number;
  saved: number;
  color: string;
  emoji: string;
}

const colors = [
  'from-primary/20 to-primary/5',
  'from-blue-500/20 to-blue-500/5',
  'from-purple-500/20 to-purple-500/5',
  'from-green-500/20 to-green-500/5',
  'from-amber-500/20 to-amber-500/5',
];
const emojis = ['🐷', '🏠', '✈️', '🎓', '💍', '🚗', '💻', '🌴'];

export default function SafesDashboard() {
  const [safes, setSafes] = useState<Safe[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);

  const createSafe = () => {
    const val = parseFloat(target);
    if (!name.trim() || isNaN(val) || val <= 0) {
      toast.error('Please fill in all fields with valid values');
      return;
    }

    const newSafe: Safe = {
      id: crypto.randomUUID(),
      name: name.trim(),
      target: val,
      saved: 0,
      color: colors[safes.length % colors.length],
      emoji: selectedEmoji,
    };

    setSafes(prev => [...prev, newSafe]);
    setName('');
    setTarget('');
    setOpen(false);
    toast.success(`"${newSafe.name}" safe created!`);
  };

  const deleteSafe = (id: string) => {
    setSafes(prev => prev.filter(s => s.id !== id));
    toast.info('Safe removed');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Safes</h1>
          <p className="text-muted-foreground mt-1">Dedicated savings buckets for every goal</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Safe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Safe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Choose an Emoji</Label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setSelectedEmoji(e)}
                      className={`text-2xl w-10 h-10 rounded-lg border-2 transition-all ${
                        selectedEmoji === e ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="safe-name">Safe Name</Label>
                <Input
                  id="safe-name"
                  placeholder="e.g. Emergency Fund, Vacation..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="safe-target">Target Amount ($)</Label>
                <Input
                  id="safe-target"
                  type="number"
                  placeholder="e.g. 5000"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                />
              </div>

              <Button className="w-full gap-2" onClick={createSafe}>
                <PlusCircle className="h-4 w-4" /> Create Safe
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {safes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <Vault className="h-16 w-16 mb-4 opacity-30" />
          <h3 className="text-xl font-semibold mb-2">No safes yet</h3>
          <p className="max-w-xs mb-6">Create your first savings safe to start tracking your financial goals.</p>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Create Your First Safe
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {safes.map((safe, i) => (
              <motion.div
                key={safe.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`bg-gradient-to-br ${safe.color} border-none shadow-md group hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl">{safe.emoji}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => deleteSafe(safe.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{safe.name}</CardTitle>
                    <CardDescription>
                      <Target className="inline h-3.5 w-3.5 mr-1" />
                      Target: ${safe.target.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>${safe.saved.toFixed(2)}</span>
                        <span>{((safe.saved / safe.target) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={(safe.saved / safe.target) * 100} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" size="sm" className="w-full">
                      Add Funds
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
