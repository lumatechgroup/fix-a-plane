import React, { useState } from 'react';
import { Plane, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ReviewValidation = () => {
  const [tailNumber, setTailNumber] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [aircraftData, setAircraftData] = useState(null);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    setIsValidating(true);
    setError('');
    // Simulate FAA Database lookup
    setTimeout(() => {
      if (tailNumber.toUpperCase().startsWith('N')) {
        setAircraftData({
          make: 'CESSNA',
          model: '172S',
          year: '2012',
          type: 'Fixed wing single engine'
        });
      } else {
        setError('Invalid N-Number. Please check and try again.');
      }
      setIsValidating(false);
    }, 1500);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-black tracking-tight">Verify Your Service</h3>
      </div>

      <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
        To maintain the highest trust, we verify the aircraft associated with every review against the FAA Registry.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Tail Number</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={tailNumber}
              onChange={(e) => setTailNumber(e.target.value)}
              placeholder="e.g. N12345"
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 uppercase"
            />
            <button 
              onClick={handleValidate}
              disabled={!tailNumber || isValidating}
              className="bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
            </button>
          </div>
        </div>

        {aircraftData && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-xs font-black text-emerald-900 uppercase tracking-wider">FAA Match Found</p>
              <p className="text-sm text-emerald-700 font-bold">
                {aircraftData.year} {aircraftData.make} {aircraftData.model}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3 text-rose-600">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}
      </div>

      {aircraftData && (
        <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-blue-200 transition-all">
          Continue to Review
        </button>
      )}
    </div>
  );
};

export default ReviewValidation;
