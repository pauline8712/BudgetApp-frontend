import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { isAdmin } from '../helpers/auth';
import { formatCurrency } from '../helpers/format';

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, budgetsRes] = await Promise.all([
          api.get('/users'),
          api.get('/budgets/all'),
        ]);
        setUsers(usersRes.data);
        setBudgets(budgetsRes.data);
      } catch {
        setError('Kunde inte hämta admindata');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <p className="p-8">Laddar...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Admin</h1>
      </div>

      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'users' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'
            }`}
          >
            Användare ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'budgets' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'
            }`}
          >
            Budgetar ({budgets.length})
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        {activeTab === 'users' && (
          <>
            {users.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Skapad: {new Date(user.createdAt).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'Admin'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'budgets' && (
          <>
            {budgets.map((budget) => (
              <div key={budget.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-gray-900">{budget.name}</p>
                  <p className="text-sm font-medium text-gray-700">{formatCurrency(budget.totalAmount)}</p>
                </div>
                <p className="text-xs text-gray-400">{budget.month}/{budget.year}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;