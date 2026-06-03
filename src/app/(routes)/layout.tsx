import DashboardNav from '@/components/layout/DashboardNav';
import Footer from '@/components/layout/Footer';

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNav />
      <main className="flex-1 bg-surface-bright flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
