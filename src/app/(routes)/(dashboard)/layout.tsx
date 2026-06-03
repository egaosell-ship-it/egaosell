

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-grow w-full px-4 py-4 flex flex-col gap-4">
      {children}
    </div>
  );
}
