import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

export const MaterialReceivedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-ink">Material received</h2>
        <p className="text-xs text-muted">Step 1 of 4: Photo of bill or challan</p>
      </div>

      <div className="p-8 rounded-2xl bg-paper border-2 border-dashed border-line text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-sand/40 flex items-center justify-center text-ink">
          <Camera className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <div>
          <span className="text-sm font-medium text-ink block">Take photo of bill</span>
          <span className="text-xs text-muted">or upload challan image</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/app')}
        className="w-full h-14 rounded-2xl bg-ink text-paper text-base font-medium flex items-center justify-center shadow-soft"
      >
        Continue (Step 10 full flow)
      </button>
    </div>
  );
};
