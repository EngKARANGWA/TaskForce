import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createCategory, getCategories } from "@/lib/queries/category";
import CategoryForm from "@/app/(bp)/categories/CategoryForm";

export default async function CategoriesPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
        <h2 className="text-2xl font-semibold text-center mt-6 text-gray-700">
          Please log in to continue
        </h2>
      </div>
    );
  }

  try {
    const categories = await getCategories(user.id);

    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen py-8 px-6 mt-15">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Categories</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id as string | number} className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition-all duration-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name as string}</h3>
                <p className="text-gray-600 mb-2">{category.description as string}</p>
                {typeof category.parentId === 'string' && (
                  <p className="text-gray-500">Parent ID: {category.parentId}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a New Category</h2>
            <CategoryForm
              onSubmit={async (data) => {
                'use server';
                if (!user?.id) return;
                if (data.name) {
                  await createCategory({
                    ...data,
                    name: data.name || "", // Ensure name is always a string
                    kindeId: user.id,
                  });
                } else {
                  console.error("Category name is required");
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
  }
}
