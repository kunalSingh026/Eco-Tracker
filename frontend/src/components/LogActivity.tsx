// frontend/src/components/LogActivity.tsx
import { useState } from 'react';
import { logDailyFootprint, MOCK_USER_ID } from '../services/api';

interface LogActivityProps {
  onLogSuccess: () => void; // Callback to refresh the chart immediately
}

export default function LogActivity({ onLogSuccess }: LogActivityProps) {
  const [commuteMode, setCommuteMode] = useState('walk');
  const [distance, setDistance] = useState('0');
  const [mealType, setMealType] = useState('vegan');
  const [energy, setEnergy] = useState('0');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await logDailyFootprint(MOCK_USER_ID, {
      commuteMode: commuteMode as any,
      commuteDistanceKm: parseFloat(distance) || 0,
      mealType: mealType as any,
      energyKwh: parseFloat(energy) || 0,
    });

    setLoading(false);
    if (result.success) {
      alert("Activity logged perfectly!");
      onLogSuccess(); // Triggers the dashboard chart to reload with the new data point
    } else {
      alert("Error saving log.");
    }
  };

  return (
    <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', color: '#333' }}>
      <h3>Log Daily Activities</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>Commute Mode:</label>
          <select value={commuteMode} onChange={(e) => setCommuteMode(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
            <option value="walk">Walking / Cycling</option>
            <option value="public_transport">Public Transit (Bus/Train)</option>
            <option value="car">Personal Car</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>Commute Distance (km):</label>
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>Daily Meals:</label>
          <select value={mealType} onChange={(e) => setMealType(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
            <option value="vegan">Pure Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="meat_heavy">Meat Heavy</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>Household Energy Usage (kWh):</label>
          <input type="number" value={energy} onChange={(e) => setEnergy(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <button type="submit" disabled={loading} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? 'Calculating...' : 'Submit Log & Calculate CO₂'}
        </button>
      </form>
    </div>
  );
}
