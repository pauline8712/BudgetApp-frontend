import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

function useCategories(budgetId) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!budgetId) return;
    try {
      const response = await api.get(`/categories/${budgetId}`);
      setCategories(response.data);
    } catch {
      setError('Kunde inte hämta kategorier');
    } finally {
      setLoading(false);
    }
  }, [budgetId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

export default useCategories;