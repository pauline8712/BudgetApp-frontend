import { useEffect, useState } from 'react';
import api from '../services/api';
import CategoryCard from '../components/CategoryCard';
import ProgressBar from '../components/ProgressBar';
import TransactionItem from '../components/TransactionItem';
import useBudgetSummary from '../hooks/useBudgetSummary';
import { formatCurrency } from '../helpers/format';
import { calcRemaining } from '../helpers/calculations';
import { getBudgetId } from '../helpers/auth';

const DAGNAMN = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const jan4 = new Date(d.getFullYear(), 0, 4);
  return {
    week: 1 + Math.round(((d - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7),
    year: d.getFullYear(),
  };
}

function getMondayOfISOWeek(year, week) {
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + (week - 1) * 7);
  return monday;
}

function formatDateRange(year, week) {
  const monday = getMondayOfISOWeek(year, week);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const opts = { day: 'numeric', month: 'long' };
  return `${monday.toLocaleDateString('sv-SE', opts)} — ${sunday.toLocaleDateString('sv-SE', opts)} ${sunday.getFullYear()}`;
}

function getDayDots(transactions, year, week) {
  const monday = getMondayOfISOWeek(year, week);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return transactions.some((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getFullYear() === day.getFullYear() &&
        tDate.getMonth() === day.getMonth() &&
        tDate.getDate() === day.getDate()
      );
    });
  });
}

function Statistics() {
  const [BUDGET_ID] = useState(getBudgetId());
  const { summary, loading, error } = useBudgetSummary(BUDGET_ID);
  const [activeTab, setActiveTab] = useState('manad');
  const [currentWeek, setCurrentWeek] = useState(() => getISOWeek(new Date()));
  const [weeklyTransactions, setWeeklyTransactions] = useState({});
  const [weekLoading, setWeekLoading] = useState(false);
  const [weekError, setWeekError] = useState(null);

  useEffect(() => {
    if (activeTab !== 'vecka' || !summary) return;

    const veckokategorier = summary.categories.filter((c) => c.isWeekly);

    const fetchWeeklyTransactions = async () => {
      setWeekLoading(true);
      setWeekError(null);
      try {
        const results = await Promise.all(
          veckokategorier.map(async (cat) => {
            const response = await api.get(
              `/transactions/byweek/${cat.id}/${currentWeek.year}/${currentWeek.week}`
            );
            return { categoryId: cat.id, transactions: response.data };
          })
        );
        const mapped = {};
        results.forEach(({ categoryId, transactions }) => {
          mapped[categoryId] = transactions;
        });
        setWeeklyTransactions(mapped);
      } catch (err) {
        setWeekError('Kunde inte hämta veckotransaktioner');
      } finally {
        setWeekLoading(false);
      }
    };

    fetchWeeklyTransactions();
  }, [activeTab, currentWeek, summary]);

  if (loading) return <p className="p-8">Laddar...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!summary) return null;

  const veckokategorier = summary.categories.filter((c) => c.isWeekly);
  const fastaKostnader = summary.categories.filter((c) => !c.isWeekly);

  const veckobudget = veckokategorier.reduce((sum, c) => sum + c.weeklyAmount, 0);
  const spenderatVecka = veckokategorier.reduce((sum, c) => {
    const transactions = weeklyTransactions[c.id] || [];
    return sum + transactions
      .filter((t) => t.type === 'Expense')
      .reduce((s, t) => s + t.amount, 0);
  }, 0);
  const kvarVecka = calcRemaining(veckobudget, spenderatVecka);

  const handlePrevWeek = () => {
    const monday = getMondayOfISOWeek(currentWeek.year, currentWeek.week);
    monday.setDate(monday.getDate() - 7);
    setCurrentWeek(getISOWeek(monday));
  };

  const handleNextWeek = () => {
    const monday = getMondayOfISOWeek(currentWeek.year, currentWeek.week);
    monday.setDate(monday.getDate() + 7);
    setCurrentWeek(getISOWeek(monday));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <p className="text-xs text-gray-400 mb-1">{summary.month}/{summary.year}</p>
        <h1 className="text-2xl font-semibold text-gray-900">{summary.name}</h1>
      </div>

      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('manad')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'manad' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'
            }`}
          >
            Månad
          </button>
          <button
            onClick={() => setActiveTab('vecka')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'vecka' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'
            }`}
          >
            Vecka
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        {activeTab === 'manad' && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Total budget</p>
                <p className="text-lg font-medium text-gray-900">{formatCurrency(summary.totalAmount)}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Spenderat</p>
                <p className="text-lg font-medium text-red-600">{formatCurrency(summary.totalSpent)}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Kvar</p>
                <p className="text-lg font-medium text-green-700">{formatCurrency(summary.remainingAmount)}</p>
              </div>
            </div>
            {veckokategorier.length > 0 && (
              <>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Veckokategorier</p>
                {veckokategorier.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </>
            )}
            {fastaKostnader.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Fasta kostnader</p>
                {fastaKostnader.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'vecka' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <button onClick={handlePrevWeek} className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">←</button>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">Vecka {currentWeek.week}</p>
                <p className="text-xs text-gray-400">{formatDateRange(currentWeek.year, currentWeek.week)}</p>
              </div>
              <button onClick={handleNextWeek} className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">→</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Veckobudget</p>
                <p className="text-lg font-medium text-gray-900">{formatCurrency(veckobudget)}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Spenderat</p>
                <p className="text-lg font-medium text-red-600">{formatCurrency(spenderatVecka)}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Kvar</p>
                <p className={`text-lg font-medium ${kvarVecka >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {formatCurrency(kvarVecka)}
                </p>
              </div>
            </div>
            {weekError && <p className="text-red-500 text-sm mb-4">{weekError}</p>}
            {weekLoading && <p className="text-sm text-gray-400 mb-4">Laddar transaktioner...</p>}
            {!weekLoading && veckokategorier.length > 0 && (
              <>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Veckokategorier</p>
                {veckokategorier.map((category) => {
                  const transactions = weeklyTransactions[category.id] || [];
                  const spentThisWeek = transactions
                    .filter((t) => t.type === 'Expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                  const remaining = calcRemaining(category.weeklyAmount, spentThisWeek);
                  const dayDots = getDayDots(transactions, currentWeek.year, currentWeek.week);
                  return (
                    <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-400">
                          {formatCurrency(remaining)} / {formatCurrency(category.weeklyAmount)}
                        </p>
                      </div>
                      <ProgressBar current={Math.max(0, remaining)} allocated={category.weeklyAmount} />
                      <div className="flex justify-between mt-3 mb-1 px-1">
                        {DAGNAMN.map((dag, i) => (
                          <div key={dag} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-gray-400">{dag}</span>
                            <span className={`w-2 h-2 rounded-full ${dayDots[i] ? 'bg-green-500' : 'bg-gray-200'}`} />
                          </div>
                        ))}
                      </div>
                      {transactions.length > 0 && (
                        <div className="mt-3 border-t border-gray-100 pt-1">
                          {transactions.map((t) => <TransactionItem key={t.id} transaction={t} />)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
            {fastaKostnader.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Fasta kostnader</p>
                {fastaKostnader.map((category) => (
                  <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-400">
                        {formatCurrency(category.currentBalance)} / {formatCurrency(category.allocatedAmount)}
                      </p>
                    </div>
                    <ProgressBar current={category.currentBalance} allocated={category.allocatedAmount} />
                    <p className="text-xs text-gray-400 mt-2">
                      Spenderat: {formatCurrency(category.amountSpent ?? 0)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Statistics;