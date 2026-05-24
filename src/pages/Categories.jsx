import { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import useCategories from '../hooks/useCategories';
import { getBudgetId } from '../helpers/auth';
import { formatCurrency } from '../helpers/format';
import api from '../services/api';

function Categories() {
  const [budgetId] = useState(getBudgetId());
  const { categories, loading, error, refetch } = useCategories(budgetId);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    allocatedAmount: '',
    isWeekly: false,
    weeklyAmount: '',
  });

  const handleEditClick = (category) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      allocatedAmount: category.allocatedAmount,
      isWeekly: category.isWeekly,
      weeklyAmount: category.weeklyAmount || '',
    });
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/categories/${id}`, {
        name: editForm.name,
        allocatedAmount: parseFloat(editForm.allocatedAmount),
        isWeekly: editForm.isWeekly,
        weeklyAmount: editForm.isWeekly ? parseFloat(editForm.weeklyAmount) : null,
      });
      setEditingId(null);
      refetch();
    } catch {
      alert('Kunde inte uppdatera kategorin');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Är du säker på att du vill ta bort kategorin?')) return;
    try {
      await api.delete(`/categories/${id}`);
      refetch();
    } catch {
      alert('Kunde inte ta bort kategorin');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', {
        budgetId: budgetId,
        name: newCategory.name,
        allocatedAmount: parseFloat(newCategory.allocatedAmount),
        isWeekly: newCategory.isWeekly,
        weeklyAmount: newCategory.isWeekly ? parseFloat(newCategory.weeklyAmount) : null,
      });
      setNewCategory({ name: '', allocatedAmount: '', isWeekly: false, weeklyAmount: '' });
      setShowAdd(false);
      refetch();
    } catch {
      alert('Kunde inte lägga till kategorin');
    }
  };

  if (loading) return <p className="p-8">Laddar...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Kategorier</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Lägg till
        </button>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        {showAdd && (
          <form onSubmit={handleAddCategory} className="bg-white border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Ny kategori</p>
            <div className="space-y-3">
              <input type="text" placeholder="Namn" required value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setNewCategory({ ...newCategory, isWeekly: false })} className={`flex-1 py-1.5 text-xs rounded-lg border ${!newCategory.isWeekly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>Månadsbudget</button>
                <button type="button" onClick={() => setNewCategory({ ...newCategory, isWeekly: true })} className={`flex-1 py-1.5 text-xs rounded-lg border ${newCategory.isWeekly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>Veckobudget</button>
              </div>
              {newCategory.isWeekly ? (
                <input type="number" placeholder="Belopp per vecka (kr)" required value={newCategory.weeklyAmount} onChange={(e) => setNewCategory({ ...newCategory, weeklyAmount: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              ) : (
                <input type="number" placeholder="Belopp per månad (kr)" required value={newCategory.allocatedAmount} onChange={(e) => setNewCategory({ ...newCategory, allocatedAmount: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              )}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700">Spara</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50">Avbryt</button>
              </div>
            </div>
          </form>
        )}

        {categories.map((category) => (
          <div key={category.id} className={`bg-white border rounded-xl p-4 mb-3 ${editingId === category.id ? 'border-blue-200' : 'border-gray-200'}`}>
            {editingId === category.id ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Redigera kategori</p>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditForm({ ...editForm, isWeekly: false })} className={`flex-1 py-1.5 text-xs rounded-lg border ${!editForm.isWeekly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>Månadsbudget</button>
                  <button type="button" onClick={() => setEditForm({ ...editForm, isWeekly: true })} className={`flex-1 py-1.5 text-xs rounded-lg border ${editForm.isWeekly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>Veckobudget</button>
                </div>
                {editForm.isWeekly ? (
                  <input type="number" value={editForm.weeklyAmount} onChange={(e) => setEditForm({ ...editForm, weeklyAmount: e.target.value })} placeholder="Belopp per vecka (kr)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                ) : (
                  <input type="number" value={editForm.allocatedAmount} onChange={(e) => setEditForm({ ...editForm, allocatedAmount: e.target.value })} placeholder="Belopp per månad (kr)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleEditSave(category.id)} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700">Spara</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50">Avbryt</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-900">{category.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">{formatCurrency(category.currentBalance)} / {formatCurrency(category.allocatedAmount)}</p>
                    <button onClick={() => handleEditClick(category)} className="w-7 h-7 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="w-7 h-7 rounded-lg border border-gray-200 bg-red-50 flex items-center justify-center hover:bg-red-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
                <ProgressBar current={category.currentBalance} allocated={category.allocatedAmount} />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">Spenderat: {formatCurrency(category.amountSpent ?? 0)}</p>
                  {category.isWeekly && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{formatCurrency(category.weeklyAmount)}/vecka</span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;