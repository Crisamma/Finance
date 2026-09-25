"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
    const pathname = usePathname(); //da qyui puoi ottenere il percorso della pagina corrente, ad esempio "/dashboard" o "/movimenti"

    return (
        <div className="sidebar">

            <div className="logo-container">
                <div className="sidebar-icons">
                    <Image className="logo"
                        src="/images/logo3.png"
                        alt="Logo Finance"
                        width={30}
                        height={30}
                        loading="eager"
                    />
                </div>

                <h1 className="finance"><b>Finance</b></h1>
            </div>

            <Link
                href="/"
                className={"sidebar-link" + (pathname === "/" ? " active" : "")}
            >
                <div className="sidebar-icons">
                    <Image className="dashboard"
                        src={
                            pathname === "/"
                                ? "/images/home-blu.png"
                                : "/images/home.png"
                        }
                        alt="Immagine Dashboard"
                        width={20}
                        height={20}
                        loading="eager"
                    />
                </div>

                <h2 className="finance">Dashboard</h2>
            </Link>


            <Link
                href="/movimenti"
                className={"sidebar-link" + (pathname === "/movimenti" ? " active" : "")}
            >
                <div className="sidebar-icons">
                    <Image className="movimenti"
                        src={
                            pathname === "/movimenti"
                                ? "/images/movimenti-blu.png"
                                : "/images/movimenti.png"
                        }
                        alt="Immagine Movimenti"
                        width={20}
                        height={20}
                        loading="eager"
                    />
                </div>

                <h2 className="finance">Movimenti</h2>
            </Link>

            <Link
                href="/conti"
                className={"sidebar-link" + (pathname === "/conti" ? " active" : "")}
            >
                <div className="sidebar-icons">
                    <Image className="logo"
                        src={
                            pathname === "/conti"
                                ? "/images/wallet-blu.png"
                                : "/images/wallet.png"
                        }
                        alt="Immagine Conti"
                        width={20}
                        height={20}
                        loading="eager"
                    />
                </div>

                <h2 className="finance">Conti</h2>
            </Link>

            <Link
                href="/budget"
                className={"sidebar-link" + (pathname === "/budget" ? " active" : "")}
            >
                <div className="sidebar-icons">
                    <Image className="budget"
                        src={
                            pathname === "/budget"
                                ? "/images/budget-blu.png"
                                : "/images/budget.png"
                        }
                        alt="Immagine Budget"
                        width={20}
                        height={20}
                        loading="eager"
                    />
                </div>
                <h2 className="finance">Budget</h2>
            </Link>

            <Link
                href="/statistiche"
                className={"sidebar-link" + (pathname === "/statistiche" ? " active" : "")}
            >
                <div className="sidebar-icons">
                    <Image className="statistiche"
                        src={
                            pathname === "/statistiche"
                                ? "/images/statistiche-blu.png"
                                : "/images/statistiche.png"
                        }
                        alt="Immagine Statistiche"
                        width={20}
                        height={20}
                        loading="eager"
                    />
                </div>
                <h2 className="finance">Statistiche</h2>
            </Link>

            <Link
                href="/obiettivi"
                className={"sidebar-link" + (pathname === "/obiettivi" ? " active" : "")}
            >
                <div className="sidebar-icons">
                    <Image className="obiettivi"
                        src={
                            pathname === "/obiettivi"
                                ? "/images/obiettivi-blu.png"
                                : "/images/obiettivi.png"
                        }
                        alt="Immagine Obiettivi"
                        width={20}
                        height={20}
                        loading="eager"
                    />
                </div>
                <h2 className="finance">Obiettivi</h2>
            </Link>

            <Link
                href="/impostazioni"
                className={"sidebar-link" + (pathname === "/impostazioni" ? " active" : "")}
            >
                <div className="sidebar-icons">
                    <Image className="impostazioni"
                        src={
                            pathname === "/impostazioni"
                                ? "/images/settings-blu.png"
                                : "/images/settings.png"
                        }
                        alt="Immagine Impostazioni"
                        width={20}
                        height={20}
                        loading="eager"
                    />
                </div>
                <h2 className="finance">Impostazioni</h2>
            </Link>
        </div>
    );
}