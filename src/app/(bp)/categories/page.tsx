import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createCategory, getCategories } from "@/lib/queries/category";
import CategoryForm from "@/app/(bp)/categories/CategoryForm";


export default async function CategoriesPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return <h2 className="text-2xl mb-2">Please log in to continue</h2>;
  }

  try {
    const categories = await getCategories(user.id);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Categories</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id as string | number} className="p-4 border rounded-md">
              <h3 className="text-xl font-semibold">{category.name as string}</h3>
              <p className="text-gray-600">{category.description as string}</p>
              {typeof category.parentId === 'string' && (
                <p className="text-gray-500">Parent ID: {category.parentId}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
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
    );
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
  }
}
