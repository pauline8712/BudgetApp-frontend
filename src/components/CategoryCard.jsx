import ProgressBar from "./ProgressBar";
import { formatCurrency } from "../helpers/format";

// Återanvändbar CategoryCard-komponent — används i Dashboard och statistiksidan
function CategoryCard({ category }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium text-gray-900">{category.name}</p>
        <p className="text-xs text-gray-400">
          {formatCurrency(category.currentBalance)} /{" "}
          {formatCurrency(category.allocatedAmount)}
        </p>
      </div>

      {/* Progressbar visar hur mycket som är kvar av budgeten */}
      <ProgressBar
        current={category.currentBalance}
        allocated={category.allocatedAmount}
      />

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-400">
          {/* amountSpent finns bara i BudgetSummary — defaultar till 0 annars */}
          Spenderat: {formatCurrency(category.amountSpent ?? 0)}
        </p>
        {/* Visar veckobudget om kategorin är veckobaserad */}
        {category.isWeekly && (
          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
            {formatCurrency(category.weeklyAmount)}/vecka
          </span>
        )}
      </div>
    </div>
  );
}

export default CategoryCard;
