import Image from "next/image";
import Link from "next/link";
import Sidebar from "./sidebar";
import DashboardCard from "./dashboardCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      
      <Sidebar />

    <div className="main-content">

        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#171717', paddingLeft: '20px' }}>
          Benvenuto, username
        </h1>
      
      <p style={{ fontSize: '16px', color: '#42454b', paddingLeft: '20px', paddingTop: '10px'}}>
        Ecco la panoramica delle tue finanze oggi.
      </p>

      <DashboardCard />
    </div>

    </main>
  );
}