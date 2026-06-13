import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { SupabasePlatformMarginRepository } from "@/infrastructure/repositories/SupabasePlatformMarginRepository";
import { GetBusinessesUseCase } from "@/core/application/use-cases/business/GetBusinessesUseCase";
import { GetPlatformMarginsUseCase } from "@/core/application/use-cases/platformMargin/GetPlatformMarginsUseCase";
import { Business } from "@/core/domain/entities/Business";
import { PlatformMargin } from "@/core/domain/entities/PlatformMargin";
import DashboardNav from '@/components/layout/DashboardNav';
import Footer from '@/components/layout/Footer';

export default async function RoutesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let businesses: Business[] = [];
  let margins: PlatformMargin[] = [];

  if (user) {
    const businessRepo = new SupabaseBusinessRepository();
    const getBusinessesUseCase = new GetBusinessesUseCase(businessRepo);
    businesses = await getBusinessesUseCase.execute(user.id);

    const marginRepo = new SupabasePlatformMarginRepository();
    const getMarginsUseCase = new GetPlatformMarginsUseCase(marginRepo);
    margins = await getMarginsUseCase.execute(user.id);
  }

  const plainBusinesses = businesses.map((b) => b.toPlainObj());
  const plainMargins = margins.map((m) => m.toPlainObj());

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNav businesses={plainBusinesses} margins={plainMargins} />
      <main className="flex-1 bg-surface-bright flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
