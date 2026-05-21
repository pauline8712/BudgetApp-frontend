import { useEffect, useState } from 'react';
import api from '../services/api';

// Custom hook för att hämta transaktioner för ett categoryId
// Hanterar loading, error och data — återanvänds i Statistics och TransactionForm
function useTransactions(categoryId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/transactions/${categoryId}`);
        setTransactions(response.data);
      } catch (err) {
        setError('Kunde inte hämta transaktioner');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [categoryId]);

  return { transactions, loading, error };
}

export default useTransactions;