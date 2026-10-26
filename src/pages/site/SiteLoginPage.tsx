import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const SiteLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUserById } = useAuth();
  const [pin, setPin] = useState('');

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setTimeout(() => {
          navigate('/app');
        }, 200);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted">Site App PIN Login</span>
        <button
          onClick={() => navigate('/login')}
          className="text-xs text-muted hover:text-ink transition-colors"
        >
          Console Login →
        </button>
      </div>

      <div className="text-center space-y-6">
        <img src="/logo.svg" alt="Studio Svara" className="w-12 h-12 mx-auto rounded-2xl" />
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">Welcome back</h1>
          <p className="text-xs text-muted mt-1">Enter your 4-digit PIN</p>
        </div>

        {/* 4 dots for PIN */}
        <div className="flex justify-center gap-4 py-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                pin.length > idx ? 'bg-ink border-ink scale-110' : 'bg-paper border-line'
              }`}
            />
          ))}
        </div>

        {/* Numeric PIN Pad */}
        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto pt-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-paper border border-line text-lg font-medium text-ink active:bg-sand/60 transition-colors shadow-xs"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-paper border border-line text-lg font-medium text-ink active:bg-sand/60 transition-colors shadow-xs"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-paper border border-line text-xs font-medium text-muted active:bg-sand/60 transition-colors shadow-xs flex items-center justify-center"
          >
            Delete
          </button>
        </div>

        {/* Demo Switcher */}
        <div className="pt-6 border-t border-line/60">
          <p className="text-xs text-muted mb-2">Demo: sign in as</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <button
              onClick={() => { setCurrentUserById('user-supervisor'); navigate('/app'); }}
              className="text-xs px-2.5 py-1 rounded-lg bg-sand/30 hover:bg-sand/60 text-ink"
            >
              Rajiv (Supervisor)
            </button>
            <button
              onClick={() => { setCurrentUserById('user-carpenter'); navigate('/app'); }}
              className="text-xs px-2.5 py-1 rounded-lg bg-sand/30 hover:bg-sand/60 text-ink"
            >
              Gurmukh (Carpenter)
            </button>
            <button
              onClick={() => { setCurrentUserById('user-electrician'); navigate('/app'); }}
              className="text-xs px-2.5 py-1 rounded-lg bg-sand/30 hover:bg-sand/60 text-ink"
            >
              Imran (Electrician)
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-muted">
        Prototype for discussion · StudioOS Site
      </footer>
    </div>
  );
};
