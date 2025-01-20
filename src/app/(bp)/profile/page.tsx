import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from 'next/image';

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Image
            src={"/assets/avatar.jpg"} 
            alt="User Avatar"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full border-4 border-green-400"
          />
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-2">
          {user?.family_name} {user?.given_name}
        </h1>
        
        <p className="text-lg text-gray-500 text-center mb-1">
          {user?.username }
        </p>
        
        <p className="text-sm text-gray-600 text-center mb-4">
          {user?.email || "No Email"}
        </p>

        <div className="flex justify-between">
          <button className="px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-200">
            Edit Profile
          </button>
          <button className="px-6 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition duration-200">
            Log Out
          </button>
        </div>
      </div>
    </main>
  );
}
