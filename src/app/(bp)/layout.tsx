import Header from "@/components/Header";

export default function RSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/5 w-full">
        <Header />
      </div>
      <div className="flex-1 px-4 py-2 overflow-auto">
        {children}
      </div>
    </div>
  );
}
