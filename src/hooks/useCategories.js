import { useEffect, useState } from 'react';
import api from '../services/api';

// Custom hook för att hämta kategorier för ett budgetId
// Hanterar loading, error och data — återanvänds i Categories och Statistics
function useCategories(budgetId) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!budgetId) return;

    const fetchCategories = async () => {
      try {
        const response = await api.get(`/categories/${budgetId}`);
        setCategories(response.data);
      } catch (err) {
        setError('Kunde inte hämta kategorier');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [budgetId]);

  return { categories, loading, error };
}

export default useCategories;