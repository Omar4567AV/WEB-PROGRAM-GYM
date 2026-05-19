import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Button, Input } from '../../../components/ui';
import { CreditCard, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const CheckoutPage: React.FC = () => {
  const { user, updateUserSubscription } = useAuth();
  const navigate = useNavigate();

  // Selected Plan
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'elite'>('pro');

  // Form Fields
  const [cardName, setCardName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter' as const,
      name: 'Starter Plan',
      price: 29,
      features: ['Custom workout schedule', 'Basic macro-diet targets', 'Chat support via requests'],
    },
    {
      id: 'pro' as const,
      name: 'Pro Athlete Plan',
      price: 59,
      features: ['Fully-customized meal schedules', 'Weekly check-in assessments', 'Direct coach messaging thread', 'Advanced auto-scheduler AI access'],
      popular: true,
    },
    {
      id: 'elite' as const,
      name: 'Elite Transformation Plan',
      price: 99,
      features: ['Daily progress coaching feedback', '24/7 priority support hotline', 'Custom supplement plans', 'Progress photo assessments'],
    },
  ];

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      setError('Please fill in all credit card details.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be exactly 16 digits.');
      return;
    }

    if (cardCvv.length !== 3) {
      setError('CVV must be 3 digits.');
      return;
    }

    try {
      setIsProcessing(true);
      // Simulate real-time secure bank payment authorization
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Update subscription state
      updateUserSubscription('active');
      
      setIsSuccess(true);
      toast.success('Payment authorized successfully!');
      
      // Delay before redirecting to dashboard for excellent UX transition
      setTimeout(() => {
        navigate('/client');
      }, 2000);
    } catch {
      setError('Payment gateway error. Please check your credentials or try again.');
      updateUserSubscription('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white dark:bg-gray-100 rounded-3xl border border-gray-100 dark:border-transparent shadow-xl p-8 text-center animate-in scale-in duration-300">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-12 h-12 animate-pulse" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight m-0">Payment Successful!</h2>
        <p className="text-gray-500 font-semibold mt-3 mb-6">Your plan is active and your dashboard is unlocked.</p>
        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-transparent p-4 rounded-2xl flex items-center justify-between text-left mb-6">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 dark:text-emerald-400 m-0">Active Plan</p>
            <h4 className="font-extrabold text-gray-900 text-sm mt-1 mb-0 capitalize">{selectedPlan} Member</h4>
          </div>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xl">${plans.find(p => p.id === selectedPlan)?.price}/mo</span>
        </div>
        <p className="text-xs text-gray-400 font-semibold m-0">Redirecting you to your fitness dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight m-0">Unlock Your All-Access Account</h2>
        <p className="text-gray-500 font-semibold text-sm mt-2 mb-0">Choose a premium gym & diet plan tailored to your lifestyle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelectedPlan(plan.id)}
            className={`card flex flex-col justify-between text-left transition-all duration-300 relative overflow-hidden h-full border-2
              ${selectedPlan === plan.id
                ? 'border-[var(--primary)] shadow-md shadow-red-500/5 bg-red-50/10'
                : 'border-transparent hover:border-gray-200'
              }
            `}
          >
            {plan.popular && (
              <span className="absolute top-3 right-3 bg-[var(--primary)] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Popular
              </span>
            )}
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 text-lg m-0">{plan.name}</h4>
                <div className="flex items-baseline mt-2 gap-1">
                  <span className="text-2xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">/ month</span>
                </div>
              </div>

              <ul className="space-y-2 border-t border-gray-100 pt-4 m-0 p-0 list-none text-xs text-gray-600 font-medium leading-relaxed">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <span className={`w-full text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider block transition-colors
                ${selectedPlan === plan.id
                  ? 'bg-[var(--primary)] text-white shadow-md shadow-red-500/10'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}>
                {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Payment Details Form */}
      <div className="card max-w-xl mx-auto border border-gray-100 shadow-lg p-8">
        <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[var(--primary)]" /> Secure Card Checkout
        </h3>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <Input
            label="Cardholder Name"
            type="text"
            placeholder={user?.name || 'Omar Ahmed'}
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />

          <Input
            label="Credit Card Number"
            type="text"
            placeholder="4123 4567 8901 2345"
            value={cardNumber}
            onChange={(e) => {
              // Strip letters and format card pattern
              const val = e.target.value.replace(/\D/g, '').substring(0, 16);
              const formatted = val.replace(/(.{4})/g, '$1 ').trim();
              setCardNumber(formatted);
            }}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              type="text"
              placeholder="MM/YY"
              value={cardExpiry}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                if (val.length >= 2) {
                  setCardExpiry(val.substring(0, 2) + '/' + val.substring(2));
                } else {
                  setCardExpiry(val);
                }
              }}
              required
            />
            <Input
              label="CVV"
              type="password"
              placeholder="123"
              value={cardCvv}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').substring(0, 3);
                setCardCvv(val);
              }}
              required
            />
          </div>

          <p className="text-[10px] text-gray-400 leading-relaxed font-medium bg-gray-50 dark:bg-gray-150/10 p-3 rounded-lg border border-gray-100/50 mt-4 mb-6">
            🔒 By clicking pay, you authorize a secure transaction of <strong>${plans.find(p => p.id === selectedPlan)?.price}.00 USD</strong>. All card transactions are simulated, highly encrypted, and fully sandbox-compliant.
          </p>

          <Button
            type="submit"
            fullWidth
            isLoading={isProcessing}
            leftIcon={<Sparkles className="w-4 h-4 animate-spin-slow" />}
            className="py-3 rounded-xl text-sm"
          >
            Authorize Payment & Activate Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
