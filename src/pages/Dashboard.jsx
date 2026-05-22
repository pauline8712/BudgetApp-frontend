import CategoryCard from '../components/CategoryCard';
import useBudgetSummary from '../hooks/useBudgetSummary';
import { formatCurrency } from '../helpers/format';

// Hårdkodat budget-id för testning — ersätts med riktigt id när JWT är implementerat
const BUDGET_ID = '085b0705-dd17-4f3c-9ca3-fcc6a8f53b15';

function Dashboard() {
  // Använder custom hook istället för useEffect direkt i komponenten
  const { summary, loading, error } = useBudgetSummary(BUDGET_ID);

  if (loading) return <p className="p-8">Laddar...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!summary) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <p className="text-xs text-gray-400 mb-1">{summary.month}/{summary.year}</p>
        <h1 className="text-2xl font-semibold text-gray-900">{summary.name}</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        {/* Summakort */}
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

        {/* Kategorier — använder återanvändbar CategoryCard */}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Kategorier</p>
        {summary.categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;