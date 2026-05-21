import CategoryCard from '../components/CategoryCard';
import useCategories from '../hooks/useCategories';

// Hårdkodat budget-id för testning — ersätts med riktigt id när JWT är implementerat
const BUDGET_ID = 'ce54634e-79e9-422e-a7eb-59292d576c16';

function Categories() {
  // Använder custom hook istället för useEffect direkt i komponenten
  const { categories, loading, error } = useCategories(BUDGET_ID);

  if (loading) return <p className="p-8">Laddar...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Kategorier</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        {/* Använder återanvändbar CategoryCard */}
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default Categories;