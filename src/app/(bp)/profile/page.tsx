
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from 'next/image';

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
        <Image
          src={"/assets/avatar.jpg"} 
          alt="User Avatar"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-2 "
        />
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          {user?.family_name} {user?.given_name}
        </h1>
        <p className="text-green-600 mb-4">{user?.email}</p>
        <p className="text-sm text-green-500">User name: {user?.username || "User"}</p>

  
    </main>
  );
}
