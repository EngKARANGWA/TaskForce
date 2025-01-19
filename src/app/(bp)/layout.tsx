import Header from "@/components/Header";

export default function RSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <div className="flex-1 px-4 py-2 overflow-auto">
        {children}
      </div>
    </div>
  );
}
