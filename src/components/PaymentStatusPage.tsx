import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Status = 'success' | 'failed' | 'pending';

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('pending');

  useEffect(() => {
    const ref = searchParams.get('reference') || searchParams.get('trxref');
    const rawStatus = searchParams.get('status');

    if (ref || rawStatus === 'success') {
      setStatus('success');
    } else if (rawStatus === 'failed' || rawStatus === 'cancelled') {
      setStatus('failed');
    }
  }, [searchParams]);

  const config = {
    success: {
      icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
      title: 'Payment Successful!',
      desc: 'Your payment was processed successfully. Your safe balance will be updated shortly.',
      color: 'from-green-500/10 to-green-500/5',
    },
    failed: {
      icon: <XCircle className="h-16 w-16 text-destructive" />,
      title: 'Payment Failed',
      desc: 'Your payment could not be processed. Please try again.',
      color: 'from-destructive/10 to-destructive/5',
    },
    pending: {
      icon: <Clock className="h-16 w-16 text-amber-500" />,
      title: 'Payment Pending',
      desc: 'Your payment is being processed. This may take a few moments.',
      color: 'from-amber-500/10 to-amber-500/5',
    },
  }[status];

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className={`bg-gradient-to-br ${config.color} border-none shadow-xl`}>
          <CardContent className="flex flex-col items-center text-center p-8 gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              {config.icon}
            </motion.div>
            <h1 className="text-2xl font-bold">{config.title}</h1>
            <p className="text-muted-foreground">{config.desc}</p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => navigate('/safes')} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Safes
              </Button>
              <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
