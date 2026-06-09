// frontend/src/components/Dashboard.tsx
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchFootprintHistory, MOCK_USER_ID } from '../services/api';
import LogActivity from './LogActivity';
import AiInsights from './AiInsights'; // 1. Import

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0); // For triggering AI re-runs

  const loadData = async () => {
    const history = await fetchFootprintHistory(MOCK_USER_ID);
    setData([...history].reverse());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [refreshCounter]);

  const handleSuccess = () => {
    setRefreshCounter(prev => prev + 1); // Increments to refresh both chart and AI panel
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '4rem' }}>Loading your eco-stats...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#fff' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>EcoSync Dashboard 🌱</h1>
        <p style={{ color: '#94a3b8' }}>Your real-time carbon footprint tracker.</p>
      </header>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <LogActivity onLogSuccess={handleSuccess} />
        </div>

        <div style={{ flex: '1.5', minWidth: '350px', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ color: '#1e293b', marginTop: 0 }}>Daily CO₂ Emissions (kg)</h3>
          
          <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="logged_at" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="total_co2_kg" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* 2. Add AI panel right below the chart inside the layout */}
          <AiInsights refreshTrigger={refreshCounter} />
        </div>
      </div>
    </div>
  );
}
