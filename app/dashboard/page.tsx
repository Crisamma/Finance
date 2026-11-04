import Sidebar from "./sidebar";
import DashboardCard from "./dashboardCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Sidebar />

      <div className="main-content">
        {/* Saluto, periodo, card e grafici vivono in DashboardCard (client component) */}
        <DashboardCard />
      </div>
    </main>
  );
}
