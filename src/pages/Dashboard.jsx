import { useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import useBudgetSummary from '../hooks/useBudgetSummary';
import { formatCurrency } from '../helpers/format';
import { getBudgetId, getUserIdFromToken } from '../helpers/auth';
import api from '../services/api';

const MONTHS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Mars' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Maj' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Augusti' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

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
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    allocatedAmount: '',
    isWeekly: false,
    weeklyAmount: '',
  });

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.allocatedAmount) return;
    setCategories([...categories, { ...newCategory }]);
    setNewCategory({ name: '', allocatedAmount: '', isWeekly: false, weeklyAmount: '' });
  };

  const handleRemoveCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const userId = getUserIdFromToken();
      const budgetResponse = await api.post('/budgets', {
        userId,
        name: form.name,
        month: parseInt(form.month),
        year: parseInt(form.year),
        totalAmount: parseFloat(form.totalAmount),
      });
      const newBudgetId = budgetResponse.data.id;

      // Skapa kategorier om det finns några
      for (const cat of categories) {
        await api.post('/categories', {
          budgetId: newBudgetId,
          name: cat.name,
          allocatedAmount: parseFloat(cat.allocatedAmount),
          isWeekly: cat.isWeekly,
          weeklyAmount: cat.isWeekly ? parseFloat(cat.weeklyAmount) : null,
        });
      }

      localStorage.setItem('budgetId', newBudgetId);
      setBudgetId(newBudgetId);
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
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm mx-auto">
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
                <select
                  required
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">År</label>
                <input
                  type="number"
                  required
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

            {/* Kategorier */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Kategorier (valfritt)</p>

              {categories.map((cat, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                    <p className="text-xs text-gray-500">
                      {cat.isWeekly ? `${cat.weeklyAmount} kr/vecka` : `${cat.allocatedAmount} kr/månad`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(index)}
                    className="text-red-400 text-xs hover:text-red-600"
                  >
                    Ta bort
                  </button>
                </div>
              ))}

              <div className="space-y-2 mt-2">
                <input
                  type="text"
                  placeholder="Kategorinamn (t.ex. Mat)"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, isWeekly: false })}
                    className={`flex-1 py-1.5 text-xs rounded-lg border ${!newCategory.isWeekly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                  >
                    Månadsbudget
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, isWeekly: true })}
                    className={`flex-1 py-1.5 text-xs rounded-lg border ${newCategory.isWeekly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                  >
                    Veckobudget
                  </button>
                </div>
                {newCategory.isWeekly ? (
                  <input
                    type="number"
                    placeholder="Belopp per vecka (kr)"
                    value={newCategory.weeklyAmount}
                    onChange={(e) => setNewCategory({ ...newCategory, weeklyAmount: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type="number"
                    placeholder="Belopp per månad (kr)"
                    value={newCategory.allocatedAmount}
                    onChange={(e) => setNewCategory({ ...newCategory, allocatedAmount: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="w-full border border-blue-600 text-blue-600 rounded-lg py-2 text-sm font-medium hover:bg-blue-50"
                >
                  + Lägg till kategori
                </button>
              </div>
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