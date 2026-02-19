'use client';

import React, { useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';  // Correct path

const CustomerSearch = () => {
  const [airportCode, setAirportCode] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('shops')
      .select('*')
      .ilike('airport_code', `%${airportCode}%`)
      .order('tier', { ascending: false });
    setShops(data || []);
    setLoading(false);
  };
return
cat > ~/Desktop/fix-a-plane/components/CustomerSearch.tsx << 'EOF'
'use client';

import React, { useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';  // Correct path

const CustomerSearch = () => {
  const [airportCode, setAirportCode] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('shops')
      .select('*')
      .ilike('airport_code', `%${airportCode}%`)
      .order('tier', { ascending: false });
    setShops(data || []);
    setLoading(false);
  };
Call
                </a>
                <a href={`mailto:${shop.email}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-center font-bold transition-all">
                  ✉️ Email
                </a>
              </div>
            </div>
          ))}
        </div>
        {shops.length === 0 && !loading && (
          <div className="col-span-full text-center py-24">
            <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-500 mb-2">No shops found</h3>
            <p className="text-slate-400 max-w-md mx-auto">Try "3N6" for Syrek-Mee Aviation or another East Coast airport.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerSearch;
