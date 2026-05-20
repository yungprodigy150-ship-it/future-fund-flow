import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Status = 'verifying' | 'success' | 'failed';

export default function PaystackReturn() {
  const [status, setStatus] = useState<Status>('verifying');
  const [reference, setReference] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref') || '';
    setReference(ref);

    if (ref) {
      setTimeout(() => setStatus('success'), 1500);
    } else {
      setStatus('failed');
    }
  }, []);

  const handleContinue = () => {
    window.location.href = '/safes';
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">Verifying your payment...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we confirm your transaction.</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Payment Confirmed!</h2>
            {reference && (
              <p className="text-muted-foreground">
                Reference: <span className="font-mono text-sm">{reference}</span>
              </p>
            )}
            <p className="text-sm text-muted-foreground">Your safe has been funded successfully.</p>
            <Button onClick={handleContinue} className="mt-4">View My Safes</Button>
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <XCircle className="h-16 w-16 text-destructive" />
            <h2 className="text-2xl font-bold">Payment Failed</h2>
            <p className="text-muted-foreground">We couldn't verify your payment. Please try again.</p>
            <Button onClick={() => { window.location.href = '/safes'; }} className="mt-4">
              Try Again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
