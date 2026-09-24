import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="sidebar">
        <div className="logo-container">
          <Image className="logo"
            src="/images/logo3.png"
            alt="Logo Finance"
            width={30}
            height={30}
            loading="eager"
          />
          <h1 className="finance"><b>Finance</b></h1>
        </div>

        <div className="movimenti-container">
          <Image className="movimenti"
            src="/images/movimenti.png"
            alt="Immagine Movimenti"
            width={20}
            height={20}
            loading="eager"
          />
          <h2 className="finance">Movimenti</h2>
        </div>

        <div className="conti-container">
          <Image className="logo"
            src="/images/wallet.png"
            alt="Immagine Conti"
            width={20}
            height={20}
            loading="eager"
          />
          <h2 className="finance">Conti</h2>
        </div>

        <div className="budget-container">
          <Image className="budget"
            src="/images/budget.png"
            alt="Immagine Budget"
            width={20}
            height={20}
            loading="eager"
          />
          <h2 className="finance">Budget</h2>
        </div>

        <div className="statistiche-container">
          <Image className="statistiche"
            src="/images/statistiche.png"
            alt="Immagine Statistiche"
            width={20}
            height={20}
            loading="eager"
          />
          <h2 className="finance">Statistiche</h2>
        </div>

        <div className="obiettivi-container">
          <Image className="obiettivi"
            src="/images/obiettivi.png"
            alt="Immagine Obiettivi"
            width={20}
            height={20}
            loading="eager"
          />
          <h2 className="finance">Obiettivi</h2>
        </div>

        <div className="impostazioni-container">
          <Image className="impostazioni"
            src="/images/settings.png"
            alt="Immagine Impostazioni"
            width={20}
            height={20}
            loading="eager"
          />
          <h2 className="finance">Impostazioni</h2>
        </div>
      </div>

    </main>
  );
}