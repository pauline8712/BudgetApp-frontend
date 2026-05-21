import { useEffect, useState } from 'react';
import api from '../services/api';

// Custom hook för att hämta budgetsammanfattning
// Hanterar loading, error och data — återanvänds i Dashboard och Statistics
function useBudgetSummary(budgetId) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!budgetId) return;

    const fetchSummary = async () => {
      try {
        const response = await api.get(`/budgets/summary/${budgetId}`);
        setSummary(response.data);
      } catch (err) {
        setError('Kunde inte hämta budgetsammanfattning');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [budgetId]);

  return { summary, loading, error };
}

export default useBudgetSummary;