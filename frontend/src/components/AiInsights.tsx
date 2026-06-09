// frontend/src/components/AiInsights.tsx
import { useEffect, useState } from 'react';
import { MOCK_USER_ID } from '../services/api';

export default function AiInsights({ refreshTrigger }: { refreshTrigger: any }) {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  const getAiData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/insights/${MOCK_USER_ID}`);
      const json = await response.json();
      setInsights(json.insights || "No insights found.");
    } catch (err) {
      setInsights("Failed to load eco-recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Reload insights whenever the data logs get updated
  useEffect(() => {
    getAiData();
  }, [refreshTrigger]);

  return (
    <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginTop: '2rem', border: '1px solid #334155' }}>
      <h3 style={{ color: '#34d399', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        ✨ Smart AI Suggestions
      </h3>
      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>AI is analyzing your emission charts...</p>
      ) : (
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
          {insights}
        </p>
      )}
    </div>
  );
}
