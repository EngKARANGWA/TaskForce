
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <img
          src={"/assets/avatar.jpg"} 
          alt="User Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-2 "
        />
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          {user?.family_name} {user?.given_name}
        </h1>
        <p className="text-gray-600 mb-4">{user?.email}</p>
        <p className="text-sm text-gray-500">User name: {user?.username || "User"}</p>

      </div>
    </main>
  );
}
