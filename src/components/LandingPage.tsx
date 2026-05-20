import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PiggyBank, Shield, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: <PiggyBank className="h-8 w-8 text-primary" />,
    title: 'Smart Savings Safes',
    desc: 'Create dedicated savings buckets for every goal, from emergency funds to dream vacations.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: 'Track Your Progress',
    desc: 'Visual dashboards that keep your financial goals in sharp focus every day.',
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: 'Secure & Private',
    desc: 'Bank-grade security powered by Supabase keeps your financial data protected.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Instant Transfers',
    desc: 'Fund your safes instantly with Paystack — fast, reliable, and secure payments.',
  },
];

const benefits = ['No hidden fees', 'Set unlimited savings goals', 'Automatic progress tracking', 'Multi-currency support'];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm mb-8">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>Smart financial planning, simplified</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              Save Smarter,{' '}
              <span className="text-primary">Grow Faster</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              FinSmart helps you set goals, track progress, and build wealth through disciplined savings — all in one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base gap-2" asChild>
                <Link to="/signup">
                  Start Saving Today <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              {benefits.map(b => (
                <span key={b} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to reach your goals
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools designed to make saving effortless and goal-reaching inevitable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-muted/60 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 flex gap-4">
                    <div className="mt-1 shrink-0">{f.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to take control of your finances?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users building their financial future with FinSmart.
            </p>
            <Button size="lg" className="text-base gap-2" asChild>
              <Link to="/signup">
                Create Free Account <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
