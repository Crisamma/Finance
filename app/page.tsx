import Sidebar from "./sidebar";
import DashboardCard from "./dashboardCard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const username = user.user_metadata?.username || "utente";

  return (
    <main className="min-h-screen bg-white">
      <Sidebar username={username} />

      <div className="main-content">
        {/* Saluto, periodo, card e grafici vivono in DashboardCard (client component) */}

        <DashboardCard username={username} />
      </div>
    </main>
  );
}
