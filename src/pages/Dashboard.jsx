import { useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import useBudgetSummary from '../hooks/useBudgetSummary';
import { formatCurrency } from '../helpers/format';
import { getBudgetId, getUserIdFromToken } from '../helpers/auth';
import api from '../services/api';

function Dashboard() {
  const [budgetId, setBudgetId] = useState(getBudgetId());
  const { summary, loading, error } = useBudgetSummary(budgetId);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalAmount: '',
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const userId = getUserIdFromToken();
      const response = await api.post('/budgets', {
        userId,
        name: form.name,
        month: parseInt(form.month),
        year: parseInt(form.year),
        totalAmount: parseFloat(form.totalAmount),
      });
      localStorage.setItem('budgetId', response.data.id);
      setBudgetId(response.data.id);
    } catch (err) {
      alert('Kunde inte skapa budget');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p className="p-8">Laddar...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  if (!budgetId || !summary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Välkommen!</h1>
          <p className="text-sm text-gray-500 mb-6">Skapa din första budget för att komma igång.</p>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Namn</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="t.ex. Maj 2026"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Månad</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  required
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
  <label className="block text-sm text-gray-600 mb-1">Månad</label>
  <select
    required
    value={form.month}
    onChange={(e) => setForm({ ...form, month: e.target.value })}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="1">Januari</option>
    <option value="2">Februari</option>
    <option value="3">Mars</option>
    <option value="4">April</option>
    <option value="5">Maj</option>
    <option value="6">Juni</option>
    <option value="7">Juli</option>
    <option value="8">Augusti</option>
    <option value="9">September</option>
    <option value="10">Oktober</option>
    <option value="11">November</option>
    <option value="12">December</option>
  </select>
</div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Total budget (kr)</label>
              <input
                type="number"
                required
                value={form.totalAmount}
                onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="t.ex. 10000"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Skapar...' : 'Skapa budget'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <p className="text-xs text-gray-400 mb-1">{summary.month}/{summary.year}</p>
        <h1 className="text-2xl font-semibold text-gray-900">{summary.name}</h1>
      </div>
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Total budget</p>
            <p className="text-xl font-medium text-gray-900">{formatCurrency(summary.totalAmount)}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Kvar</p>
            <p className="text-xl font-medium text-green-700">{formatCurrency(summary.remainingAmount)}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Spenderat</p>
            <p className="text-xl font-medium text-red-600">{formatCurrency(summary.totalSpent)}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Kategorier</p>
            <p className="text-xl font-medium text-gray-900">{summary.categories.length} st</p>
          </div>
        </div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Kategorier</p>
        {summary.categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;