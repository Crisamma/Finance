"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  icon: string; // nome base dell'immagine in /public/images (es. "home" -> home.png / home-blu.png)
  alt: string;
};

const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "home", alt: "Immagine Dashboard" },
  { href: "/movimenti", label: "Movimenti", icon: "movimenti", alt: "Immagine Movimenti" },
  { href: "/conti", label: "Conti", icon: "wallet", alt: "Immagine Conti" },
  { href: "/budget", label: "Budget", icon: "budget", alt: "Immagine Budget" },
  { href: "/statistiche", label: "Statistiche", icon: "statistiche", alt: "Immagine Statistiche" },
  { href: "/obiettivi", label: "Obiettivi", icon: "obiettivi", alt: "Immagine Obiettivi" },
  { href: "/impostazioni", label: "Impostazioni", icon: "settings", alt: "Immagine Impostazioni" },
];

export default function Sidebar({ username }: { username: string }) {
  const pathname = usePathname(); // percorso della pagina corrente, ad esempio "/" o "/movimenti"

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="sidebar-icons">
          <Image
            className="logo"
            src="/images/logo3.png"
            alt="Logo Finance"
            width={30}
            height={30}
            loading="eager"
          />
        </div>
        <h1 className="finance">
          <b>Finance</b>
        </h1>
      </div>

      <nav className="sidebar-nav" aria-label="Navigazione principale">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={"sidebar-link" + (active ? " active" : "")}
              aria-current={active ? "page" : undefined}
            >
              <div className="sidebar-icons">
                <Image
                  src={`/images/${item.icon}${active ? "-blu" : ""}.png`}
                  alt={item.alt}
                  width={20}
                  height={20}
                  loading="eager"
                />
              </div>
              <h2>{item.label}</h2>
            </Link>
          );
        })}
      </nav>

      {/* Profilo utente in fondo (sostituire con i dati reali dell'utente) */}
      <div className="sidebar-user">
        <div className="sidebar-avatar" aria-hidden="true">
          U
        </div>
        <div className="sidebar-user-text">
          <span className="sidebar-user-name">{username}</span>
          <span className="sidebar-user-plan">Piano gratuito</span>
        </div>
      </div>
    </aside>
  );
}
