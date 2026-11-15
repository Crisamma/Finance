"use client";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../sidebar";
import { supabase } from "@/lib/supabase/client";

/*
  Pagina MOVIMENTI: solo grafica, nessun JavaScript.
  - Dati di esempio scritti direttamente nel markup: andranno sostituiti con i dati reali.
  - La finestra "Nuova transazione" si apre/chiude solo con CSS (:target):
    il link href="#nuova-transazione-modal" la apre, href="#" la chiude.
  - Filtri, ricerca e form non sono ancora collegati a nulla (TODO: Supabase).
  - Per aggiungere un movimento copia un blocco <div className="mov-row"> ... </div>.
*/

export default function Movimenti() {

  const [movimenti, setMovimenti] = useState<Movimento[]>([]);
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [conto_id, setContoId] = useState("");
  const [categoria, setCategoria] = useState("Casa");
  const [tipo, setTipo] = useState("uscita");
  const [importo, setImporto] = useState(0);
  const [data, setData] = useState(new Date());
  const [conti, setConti] = useState<Conto[]>([]);
  const [modalMode, setModalMode] = useState<"creazione" | "modifica">("creazione");
  const [modalAperto, setModalAperto] = useState(false);
  const [menuAperto, setMenuAperto] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [movimentoSelezionato, setMovimentoSelezionato] = useState<string | null>(null);
  const [contoDestinazione, setContoDestinazione] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("tutti");
  const [filtroConto, setFiltroConto] = useState("tutti");
  const [filtroCategoria, setFiltroCategoria] = useState("tutti");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroData, setFiltroData] = useState("mese");
  const [paginaCorrente, setPaginaCorrente] = useState(1);
  const movimentiPerPagina = 10;

  const indiceInizio = (paginaCorrente - 1) * movimentiPerPagina;
  const indiceFine = indiceInizio + movimentiPerPagina;

  const oggi = new Date();
  const meseCorrente = oggi.getMonth();
  const meseScorso = new Date(oggi.getFullYear(), oggi.getMonth() - 1, 1);
  const annoCorrente = oggi.getFullYear();
  const nomeMese = oggi.toLocaleDateString("it-IT", { month: "long" });
  const nomeMesePrecedente = meseScorso.toLocaleString('it-IT', { month: 'long' });
  const meseMaiuscolo = nomeMese.charAt(0).toUpperCase() + nomeMese.slice(1);
  const mesePrecedenteMaiuscolo = nomeMesePrecedente.charAt(0).toUpperCase() + nomeMesePrecedente.slice(1);
  const inizioMese = new Date(annoCorrente, meseCorrente, 1);
  const inizioMeseScorso = new Date(annoCorrente, meseCorrente - 1, 1);
  const fineMeseScorso = new Date(annoCorrente, meseCorrente, 0);
  const inizioAnno = new Date(annoCorrente, 0, 1);
  const variazioneEntrate = calcoloVariazione("entrata");
  const variazioneUscite = calcoloVariazione("uscita");

  const tuttiMovimenti = [...filtraMovimenti()].sort((a, b) => {
    const dataA = new Date(a.data).getTime();
    const dataB = new Date(b.data).getTime();

    if (dataA !== dataB) {
      return dataB - dataA;
    }

    return new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime();
  });
  console.table(
    tuttiMovimenti.map((movimento) => ({
      nome: movimento.nome,
      data: movimento.data,
      creatoIl: movimento.created_at
    }))
  );

  const movimentiPagina = tuttiMovimenti.slice(indiceInizio, indiceFine);

  const totalePagine = Math.ceil(tuttiMovimenti.length / movimentiPerPagina);
  const pagine = Array.from(
    { length: totalePagine },
    (_, i) => i + 1
  );

  type Conto = {
    id: string;
    Nome: string;
    Tipo: string;
    Valuta: string;
    Saldo: number;
    ultime_4_cifre: string | null;
    colore: string;
    includi_patrimonio: boolean;
  };

  type Movimento = {
    id: string;
    user_id: string;
    nome: string;
    descrizione: string;
    conto_id: string;
    categoria: string | null;
    tipo: string;
    importo: number;
    data: Date;
    conto_destinazione_id: string | null;
    created_at: string;
  };

  //funzione per salvare un nuovo movimento
  async function salvaMovimento() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (modalMode === "creazione") {
      const { error } = await supabase.from("movimenti").insert([{
        user_id: user.id,
        nome: nome,
        descrizione: descrizione,
        conto_id: conto_id,
        importo: importo,
        categoria: tipo === "trasferimento" ? null : categoria,
        tipo: tipo,
        data: data.toISOString().split("T")[0],
        conto_destinazione_id: tipo === "trasferimento" ? contoDestinazione : null,
      }]);


      if (error) {
        console.log("Errore:", error);
        return;
      }
    } else if (modalMode === "modifica") {
      const { error } = await supabase
        .from("movimenti")
        .update({
          user_id: user.id,
          nome: nome,
          descrizione: descrizione,
          conto_id: conto_id,
          importo: importo,
          categoria: tipo === "trasferimento" ? null : categoria,
          tipo: tipo,
          data: data.toISOString().split("T")[0],
          conto_destinazione_id: tipo === "trasferimento" ? contoDestinazione : null,
        })
        .eq("id", movimentoSelezionato)

      if (error) {
        console.log("ID utente:", user?.id);
        console.error("Errore salvataggio movimento:", error);
        return;
      }

      // Aggiorna lo stato dei movimenti con i nuovi valori
      setMovimenti(movimenti.map((movimento) => {
        if (movimento.id === movimentoSelezionato) {
          return {
            ...movimento,
            nome: nome,
            descrizione: descrizione,
            conto_id: conto_id,
            importo: importo,
            categoria: tipo === "trasferimento" ? null : categoria,
            tipo: tipo,
            data: new Date(data),
            conto_destinazione_id: tipo === "trasferimento" ? contoDestinazione : null,
          };
        }

        return movimento;
      }));
    }

    console.log("Movimento salvato!");
    setModalAperto(false);
  }

  function assegnaNome(idConto: string) {
    const conto = conti.find((conto) => conto.id === idConto);

    if (conto) {
      setNome("Trasferimento a " + conto.Nome);
    }
  }

  function modificaMovimento(movimento: Movimento) {
    setMovimentoSelezionato(movimento.id);

    setNome(movimento.nome);
    setDescrizione(movimento.descrizione);
    setCategoria(movimento.categoria ?? "Casa");
    setTipo(movimento.tipo);
    setImporto(movimento.importo);
    setData(new Date(movimento.data));
    setContoId(movimento.conto_id);
    setContoDestinazione(movimento.conto_destinazione_id ?? "");

    setModalMode("modifica");
    setModalAperto(true);
  }

  async function eliminaMovimento(id: string) {
    const { error } = await supabase
      .from("movimenti")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setMovimenti(movimenti.filter((movimento) =>
      movimento.id !== id
    ));

    setMenuAperto(null);
  }

  function filtraMovimenti() {
    return movimenti
      .filter((movimento) =>
        filtroTipo === "tutti" || movimento.tipo === filtroTipo
      )
      .filter((movimento) =>
        filtroCategoria === "tutti" ? true : movimento.categoria === filtroCategoria
      )
      .filter((movimento) =>
        filtroConto === "tutti" ||
        movimento.conto_id === filtroConto ||
        movimento.conto_destinazione_id === filtroConto
      )
      .filter((movimento) => {
        const dataMovimento = new Date(movimento.data);

        if (filtroData === "settimana") {
          const setteGiorniFa = new Date();
          setteGiorniFa.setDate(setteGiorniFa.getDate() - 6);
          setteGiorniFa.setHours(0, 0, 0, 0);

          return dataMovimento >= setteGiorniFa;
        }

        if (filtroData === "mese") {
          return dataMovimento >= inizioMese;
        }

        if (filtroData === "mese-prec") {
          return dataMovimento >= inizioMeseScorso &&
            dataMovimento <= fineMeseScorso;
        }

        if (filtroData === "anno") {
          return dataMovimento >= inizioAnno;
        }

        return true;
      })
      .filter((movimento) =>
        movimento.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );
  }


  function inserimentoImporto(movimento: Movimento) {
    if (movimento.tipo === "uscita") {
      return `− € ${movimento.importo.toFixed(2)}`;
    } else if (movimento.tipo === "entrata") {
      return `+ € ${movimento.importo.toFixed(2)}`;
    } else if (movimento.tipo === "trasferimento") {
      return `€ ${movimento.importo.toFixed(2)}`;
    }
  }

  function movimentiDelPeriodo() {
    return movimenti.filter(movimento => {
      const dataMovimento = new Date(movimento.data);

      if (filtroData === "settimana") {
        const setteGiorniFa = new Date();
        setteGiorniFa.setDate(setteGiorniFa.getDate() - 7);
        return dataMovimento >= setteGiorniFa;
      }

      if (filtroData === "mese") {
        return dataMovimento >= inizioMese;
      }

      if (filtroData === "mese-prec") {
        return dataMovimento >= inizioMeseScorso &&
          dataMovimento <= fineMeseScorso;
      }

      if (filtroData === "anno") {
        return dataMovimento >= inizioAnno;
      }

      return true;
    });
  }

  function calcoloEntrate() {
    return movimentiDelPeriodo()
      .filter(movimento => movimento.tipo === "entrata")
      .reduce((accumulatore, movimento) => accumulatore + movimento.importo, 0);
  }

  function calcoloUscite() {
    return movimentiDelPeriodo()
      .filter(movimento => movimento.tipo === "uscita")
      .reduce((accumulatore, movimento) => accumulatore + movimento.importo, 0);
  }

  function calcoloTotaleMensile(tipo: string, mese: number, anno: number) {
    return movimenti
      .filter(movimento => {
        const data = new Date(movimento.data);
        return (
          movimento.tipo === tipo &&
          data.getMonth() === mese &&
          data.getFullYear() === anno
        );
      })
      .reduce((accumulatore, movimento) => accumulatore + movimento.importo, 0);
  }

  function calcoloVariazione(tipo: string) {
    const oggi = new Date();

    const meseAttuale = oggi.getMonth();
    const annoAttuale = oggi.getFullYear();

    // Il mese precedente, gestendo anche gennaio
    const dataMesePrecedente = new Date(annoAttuale, meseAttuale - 1, 1);

    const totaleAttuale = calcoloTotaleMensile(tipo, meseAttuale, annoAttuale);

    const totalePrecedente = calcoloTotaleMensile(
      tipo,
      dataMesePrecedente.getMonth(),
      dataMesePrecedente.getFullYear()
    );

    if (totalePrecedente === 0) return null;

    return ((totaleAttuale - totalePrecedente) / totalePrecedente) * 100;
  }

  function checkPeriodo(checkTipo: string){
    if (filtroData === "settimana") {
      if(checkTipo=== "saldoNetto"){ 
        return "Settimale"
      }else if (checkTipo=== "entrateUscite") {
        return "Settimali"
      }
    }
    if (filtroData === "mese") {
      return meseMaiuscolo;
    }
    if (filtroData === "mese-prec") {
      return mesePrecedenteMaiuscolo;
    }
    if (filtroData === "anno") {
      return annoCorrente;
    }
  }
  function iconaMovimento(movimento: Movimento) {
    if (movimento.tipo === "trasferimento") {
      return "M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4";
    }

    switch (movimento.categoria) {
      case "Stipendio":
        return "M3 17l6-6 4 4 8-8M15 7h6v6";

      case "Alimentari":
        return "M3 4h2l2.4 11h10.2l2-8H6.2M9 20a1 1 0 100-2 1 1 0 000 2M17 20a1 1 0 100-2 1 1 0 000 2";

      case "Altro":
        return "M4 7h16v12H4zM9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M4 13h16";

      case "Casa":
        return "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10";

      case "Trasporti":
        return "M7 3h10a2 2 0 012 2v10a3 3 0 01-3 3H8a3 3 0 01-3-3V5a2 2 0 012-2zM5 11h14M8 21l2-3M16 21l-2-3";

      case "Salute":
        return "M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z";

      case "Svago":
        return "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z";

      case "Viaggi":
        return "M12 2c1 0 1.8 1.5 1.8 4v4l8 4.5v2l-8-2v4l2 1.5v1.5l-3.8-1-3.8 1v-1.5l2-1.5v-4l-8 2v-2l8-4.5V6c0-2.5.8-4 1.8-4z";

      case "Ristorazione":
        return "M4 3v5a3 3 0 006 0V3M7 3v18M17 21V3c-2.5 1.2-4 4-4 8h4";

      default:
        return "";
    }
  }

  function movimentiPerGiornata() {
    const ordinati = [...movimentiPagina];

    const gruppi: Record<string, Movimento[]> = {};

    ordinati.forEach((movimento) => {
      const data = new Date(movimento.data);

      const giorno = [
        data.getFullYear(),
        String(data.getMonth() + 1).padStart(2, "0"),
        String(data.getDate()).padStart(2, "0")
      ].join("-");

      if (!gruppi[giorno]) {
        gruppi[giorno] = [];
      }

      gruppi[giorno].push(movimento);
    });

    return gruppi;
  }

  function titoloGiornata(giorno: string) {
    const data = new Date(giorno + "T00:00:00");

    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    const ieri = new Date(oggi);
    ieri.setDate(ieri.getDate() - 1);

    const dataFormattata = data.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    if (data.getTime() === oggi.getTime()) {
      return `Oggi · ${dataFormattata}`;
    }

    if (data.getTime() === ieri.getTime()) {
      return `Ieri · ${dataFormattata}`;
    }

    return dataFormattata;
  }

  function coloreMovimento(movimento: Movimento) {
    if (movimento.tipo === "trasferimento") {
      return "colore-trasferimenti";
    }

    switch (movimento.categoria) {
      case "Stipendio":
        return "colore-stipendio";
      case "Alimentari":
        return "colore-alimentari";
      case "Altro":
        return "colore-altro";
      case "Casa":
        return "colore-casa";
      case "Trasporti":
        return "colore-trasporti";
      case "Salute":
        return "colore-salute";
      case "Svago":
        return "colore-svago";
      case "Viaggi":
        return "colore-viaggi";
      case "Ristorazione":
        return "colore-ristorazione";
      default:
        return "colore-altro";
    }
  }

  useEffect(() => {
    async function caricaMovimenti() {
      // Recuperiamo i movimenti da Supabase
      const { data, error } = await supabase
        .from("movimenti")
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      setMovimenti(data ?? []);

    }
    caricaMovimenti();
  }, []);

  // Funzione per chiudere il menu a tendina quando si clicca fuori
  useEffect(() => {
    function chiudiMenu(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAperto(null);
      }
    }

    document.addEventListener("mousedown", chiudiMenu);

    return () => {
      document.removeEventListener("mousedown", chiudiMenu);
    };
  }, []);

  //reset automatico alla prima pagina quando cambi un filtro
  useEffect(() => {
    setPaginaCorrente(1);
  }, [
    filtroTipo,
    filtroConto,
    filtroCategoria,
    filtroNome,
    filtroData
  ]);

  // Recuperiamo i conti da Supabase
  useEffect(() => {
    async function caricaConti() {
      const { data, error } = await supabase
        .from("conti")
        .select("*");
      if (data && data.length > 0) {
        setConti(data);
        setContoId(data[0].id);
      }

      if (error) {
        console.error(error);
        return;
      }

      setConti(data ?? []);
    }

    caricaConti();
  }, []);


  return (
    <main className="min-h-screen bg-white">
      <Sidebar />

      <div className="main-content">
        <div className="mov-page">
          {/* Intestazione */}
          <header className="mov-header">
            <div>
              <h1 className="mov-title">Movimenti</h1>
              <p className="mov-subtitle">Tutte le tue entrate e uscite, in ordine di data.</p>
            </div>
            <div className="mov-header-actions">
              {/* Esporta Un movimento TODO
              <a href="#" className="mov-btn-secondary">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
                </svg>
                Esporta
              </a>
              */}
              <button className="mov-btn-primary" onClick={() => {
                setModalAperto(true);
                setModalMode("creazione");
              }}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic" style={{ strokeWidth: 2.4 }}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Nuova transazione
              </button>
            </div>
          </header>

          {/* Riepilogo del periodo */}
          <section className="mov-summary" aria-label="Riepilogo del periodo">
            <div className="mov-stat">
              <div className="mov-stat-top">
                <span>Entrate {checkPeriodo("entrateUscite")}</span>
                <span className="mov-chip pos">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                    <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
                  </svg>
                </span>
              </div>
              <div className="mov-stat-value">€ {calcoloEntrate().toFixed(2)}</div>
              <span className={`mov-badge ${variazioneEntrate === null ? "" : variazioneEntrate >= 0 ? "pos" : "neg"
                }`}>
                {variazioneEntrate === null
                  ? "N/D"
                  : `${variazioneEntrate > 0 ? "+" : ""}${variazioneEntrate.toFixed(1).replace(".", ",")}% vs mese prec.`}
              </span>
            </div>

            <div className="mov-stat">
              <div className="mov-stat-top">
                <span>Uscite {checkPeriodo("entrateUscite")}</span>
                <span className="mov-chip warn">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                    <path d="M3 7l6 6 4-4 8 8M15 17h6v-6" />
                  </svg>
                </span>
              </div>
              <div className="mov-stat-value">€ {calcoloUscite().toFixed(2)}</div>
              <span className={`mov-badge ${variazioneUscite === null ? "" : variazioneUscite <= 0 ? "pos" : "neg"
                }`}>
                {variazioneUscite === null
                  ? "N/D"
                  : `${variazioneUscite > 0 ? "+" : ""}${variazioneUscite.toFixed(1).replace(".", ",")}% vs mese prec.`}
              </span>
            </div>

            <div className="mov-stat mov-stat-net">
              <div className="mov-stat-top">
                <span>Saldo netto {checkPeriodo("saldoNetto")}</span>
                <span className="mov-chip info">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                    <path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </span>
              </div>
              <div className={`mov-stat-value 
                ${(calcoloEntrate() - calcoloUscite()) < 0 ? "neg" : "pos"}`}>
                € {(calcoloEntrate() - calcoloUscite()).toFixed(2)}</div>
              <span className="mov-muted">{meseMaiuscolo} {annoCorrente}</span>
            </div>
          </section>

          {/* Barra filtri (solo grafica) */}
          <form className="mov-toolbar" role="search" aria-label="Filtra i movimenti">
            <div className="mov-search">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                <path d="M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-4.3-4.3" />
              </svg>
              <label htmlFor="mov-cerca" className="mov-sr">Cerca un movimento</label>
              <input id="mov-cerca" name="q" type="search" placeholder="Cerca movimento..."
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
              />
            </div>

            <div className="mov-select">
              <label htmlFor="mov-f-conto" className="mov-sr">Conto</label>
              <select id="mov-f-conto" name="conto"
                value={filtroConto}
                onChange={(e) => setFiltroConto(e.target.value)}
              >
                <option value="tutti">Tutti i conti</option>

                {conti.map((conto) => (
                  <option key={conto.id} value={conto.id}>
                    {conto.Nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="mov-select">
              <label htmlFor="mov-f-cat" className="mov-sr">Categoria</label>
              <select id="mov-f-cat" name="categoria"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}>
                <option value="tutti">Tutte le categorie</option>
                <option value="Casa">Casa</option>
                <option value="Alimentari">Alimentari</option>
                <option value="Stipendio">Stipendio</option>
                <option value="Ristorazione">Ristorazione</option>
                <option value="Viaggi">Viaggi</option>
                <option value="Trasporti">Trasporti</option>
                <option value="Svago">Svago</option>
                <option value="Salute">Salute</option>
                <option value="Altro">Altro</option>
              </select>
            </div>

            <div className="mov-select">
              <label htmlFor="mov-f-periodo" className="mov-sr">Periodo</label>
              <select id="mov-f-periodo" name="periodo"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
              >
                <option value="settimana">Ultimi 7 giorni</option>
                <option value="mese">Questo mese</option>
                <option value="mese-prec">Mese scorso</option>
                <option value="anno">Quest&apos;anno</option>
              </select>
            </div>
          </form>

          <nav className="mov-filters" aria-label="Filtra per tipo di movimento">
            <button onClick={() => setFiltroTipo("tutti")} className={filtroTipo === "tutti" ? "mov-pill on" : "mov-pill"} aria-current="true">Tutti</button>
            <button onClick={() => setFiltroTipo("entrata")} className={filtroTipo === "entrata" ? "mov-pill on" : "mov-pill"}>Entrate</button>
            <button onClick={() => setFiltroTipo("uscita")} className={filtroTipo === "uscita" ? "mov-pill on" : "mov-pill"}>Uscite</button>
            <button onClick={() => setFiltroTipo("trasferimento")} className={filtroTipo === "trasferimento" ? "mov-pill on" : "mov-pill"}>Trasferimenti</button>
          </nav>

          {/* Elenco movimenti */}
          <section className="mov-list" aria-label="Elenco movimenti" ref={menuRef}>
            <>
              <div className="mov-head" aria-hidden="true">
                <span />
                <span>Descrizione</span>
                <span>Categoria</span>
                <span>Conto</span>
                <span className="r">Importo</span>
              </div>

              {Object.entries(movimentiPerGiornata()).map(([giorno, movimentiGiornata]) => (
                <div key={giorno} className="mov-giornata">

                  <h2 className="mov-day">
                    {titoloGiornata(giorno)}
                    <span>
                      {movimentiGiornata.length > 1
                        ? ` ${movimentiGiornata.length} movimenti`
                        : ` ${movimentiGiornata.length} movimento`}
                    </span>
                  </h2>

                  {movimentiGiornata.map((movimento) => (
                    <div className="mov-row" key={movimento.id}>
                      <span className={`mov-chip ${coloreMovimento(movimento)}`}>
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                          <path d={iconaMovimento(movimento)} />
                        </svg>
                      </span>

                      <div className="mov-desc">
                        <strong>{movimento.nome}</strong>
                        <span>
                          {!movimento.descrizione
                            ? `${movimento.categoria} · ${conti.find((conto) => conto.id === movimento.conto_id)?.Nome}`
                            : movimento.descrizione
                          }
                        </span>
                      </div>
                      {movimento.tipo === "trasferimento" ? (
                        <span className="mov-cat"><i className="colore-cat-trasferimenti" />Trasferimento</span>
                      ) : (
                        <span className="mov-cat">
                          <i className={`colore-cat colore-cat-${movimento.categoria?.toLowerCase()}`} />
                          {movimento.categoria}</span>
                      )}
                      {movimento.tipo === "trasferimento" ? (
                        <span className="mov-acc">{conti.find((conto) => conto.id === movimento.conto_id)?.Nome} → {conti.find((conto) => conto.id === movimento.conto_destinazione_id)?.Nome}</span>
                      ) : (
                        <span className="mov-acc">{conti.find((conto) => conto.id === movimento.conto_id)?.Nome}</span>
                      )}
                      <span className={`mov-amt ${movimento.tipo === "entrata" ? "pos" : movimento.tipo === "uscita" ? "neg" : "transfer"}`}>{inserimentoImporto(movimento)}</span>
                      <div className="mov-menu">
                        <div className="mov-details">
                          <button
                            type="button"
                            className="mov-more"
                            aria-label="Opzioni movimento"
                            onClick={() => setMenuAperto(menuAperto === movimento.id ? null : movimento.id)}
                          >
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="mov-ic">
                              <path d="M12 6h.01M12 12h.01M12 18h.01" style={{ strokeWidth: 3 }} />
                            </svg>
                          </button>

                          {menuAperto === movimento.id && (
                            <div className="mov-dropdown">
                              <button onClick={(e) => {
                                e.preventDefault();
                                modificaMovimento(movimento);
                                setMenuAperto(null);
                              }}>
                                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="mov-ic">
                                  <path d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16zM13.5 6.5l4 4" />
                                </svg>
                                Modifica
                              </button>

                              <button className="danger" onClick={(e) => {
                                e.preventDefault();
                                eliminaMovimento(movimento.id);
                              }}>
                                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="mov-ic">
                                  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                                </svg>
                                Elimina
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          </section>

          {/* Paginazione (solo grafica) */}
          <nav className="mov-pager" aria-label="Paginazione">
            <span className="mov-muted">
              Mostro {tuttiMovimenti.length === 0 ? 0 : indiceInizio + 1}
              –{Math.min(indiceFine, tuttiMovimenti.length)} di {tuttiMovimenti.length} movimenti
            </span>
            <div className="mov-pager-links">
              <button
                className={`mov-page-btn ${paginaCorrente === totalePagine ? "disabled" : ""}`}
                aria-label="Pagina successiva"
                disabled={paginaCorrente === 1}
                onClick={() => setPaginaCorrente(paginaCorrente - 1)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              {pagine.map((pagina) => {
                const mostraPagina =
                  pagina === 1 ||
                  pagina === totalePagine ||
                  Math.abs(pagina - paginaCorrente) <= 1;

                const mostraPuntini =
                  (pagina === 2 && paginaCorrente > 3) ||
                  (pagina === totalePagine - 1 && paginaCorrente < totalePagine - 2);

                if (mostraPuntini) {
                  return <span key={pagina} className="mov-muted">…</span>;
                }

                if (!mostraPagina) return null;

                return (
                  <button
                    key={pagina}
                    className={`mov-page-btn ${paginaCorrente === pagina ? "on" : ""}`}
                    aria-current={paginaCorrente === pagina ? "page" : undefined}
                    onClick={() => setPaginaCorrente(pagina)}
                  >
                    {pagina}
                  </button>
                );
              })}
              <button
                className={`mov-page-btn ${paginaCorrente === totalePagine ? "disabled" : ""}`}
                aria-label="Pagina successiva"
                disabled={paginaCorrente === totalePagine}
                onClick={() => setPaginaCorrente(paginaCorrente + 1)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Finestra "Nuova transazione" */}
      {
        modalAperto && (
          <div id="nuova-transazione-modal" className="mov-modal" role="dialog" aria-modal="true" aria-labelledby="nuova-transazione-titolo">
            <a href="#" className="mov-modal-backdrop" aria-label="Chiudi finestra" tabIndex={-1} />

            <div className="mov-modal-box">
              <button className="mov-modal-close" aria-label="Chiudi" onClick={() => setModalAperto(false)}>
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="mov-ic">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <h2 id="nuova-transazione-titolo" className="mov-modal-title">Nuova transazione</h2>
              <p className="mov-modal-sub">Registra un&apos;entrata, un&apos;uscita o un trasferimento tra conti.</p>

              <form className="mov-form">
                <fieldset className="mov-type">
                  <legend className="mov-sr">Tipo di movimento</legend>

                  <input type="radio" name="tipo" id="tipo-uscita" value="uscita" checked={tipo === "uscita"} onChange={(e) => setTipo(e.target.value)} />
                  <label htmlFor="tipo-uscita">Uscita</label>

                  <input type="radio" name="tipo" id="tipo-entrata" value="entrata" checked={tipo === "entrata"} onChange={(e) => setTipo(e.target.value)} />
                  <label htmlFor="tipo-entrata">Entrata</label>

                  <input type="radio" name="tipo" id="tipo-trasf" value="trasferimento" checked={tipo === "trasferimento"} onChange={(e) => setTipo(e.target.value)} />
                  <label htmlFor="tipo-trasf">Trasferimento</label>
                </fieldset>

                <div className="mov-amount-field">
                  <label htmlFor="mov-importo">Importo</label>
                  <div className="mov-amount-input">
                    <span aria-hidden="true">€</span>
                    <input id="mov-importo" name="importo" type="number" step="0.01" min="0" placeholder="0,00" required
                      value={importo} onChange={(e) => setImporto(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                {tipo === "trasferimento" ? (
                  <></>
                ) : (
                  <div className="mov-field">
                    <label htmlFor="mov-descrizione">Descrizione</label>
                    <input id="mov-descrizione" name="descrizione" type="text" placeholder="Es. Spesa settimanale" required
                      value={nome} onChange={(e) => setNome(e.target.value)}
                    />
                  </div>
                )}

                <div className="mov-field-row">
                  {tipo === "trasferimento" ? (
                    <div className="mov-field">
                      <label htmlFor="mov-conto">Dal Conto</label>
                      <select
                        id="mov-conto"
                        name="conto"
                        value={conto_id}
                        onChange={(e) => setContoId(e.target.value)}
                      >
                        {conti.map((conto) => (
                          <option key={conto.id} value={conto.id}>
                            {conto.Nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="mov-field">
                      <label htmlFor="mov-categoria">Categoria</label>
                      <select id="mov-categoria" name="categoria"
                        value={categoria} onChange={(e) => setCategoria(e.target.value)}
                      >
                        <option value="Casa">Casa</option>
                        <option value="Alimentari">Alimentari</option>
                        <option value="Stipendio">Stipendio</option>
                        <option value="Ristorazione">Ristorazione</option>
                        <option value="Viaggi">Viaggi</option>
                        <option value="Trasporti">Trasporti</option>
                        <option value="Svago">Svago</option>
                        <option value="Salute">Salute</option>
                        <option value="Altro">Altro</option>
                      </select>
                    </div>
                  )}
                  {tipo === "trasferimento" ? (
                    <div className="mov-field">
                      <label htmlFor="mov-conto">Al Conto</label>
                      <select
                        id="mov-conto"
                        name="conto"
                        value={contoDestinazione}
                        onChange={(e) => {
                          setContoDestinazione(e.target.value);
                          assegnaNome(e.target.value);
                        }}
                      >
                        {conti.map((conto) => (
                          <option key={conto.id} value={conto.id}>
                            {conto.Nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="mov-field">
                      <label htmlFor="mov-conto">Conto</label>
                      <select
                        id="mov-conto"
                        name="conto"
                        value={conto_id}
                        onChange={(e) => setContoId(e.target.value)}
                      >
                        {conti.map((conto) => (
                          <option key={conto.id} value={conto.id}>
                            {conto.Nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mov-field">
                  <label htmlFor="mov-data">Data</label>
                  <input id="mov-data" name="data" type="date" required
                    value={data.toISOString().split('T')[0]} onChange={(e) => setData(new Date(e.target.value))}
                  />
                </div>

                <div className="mov-field">
                  <label htmlFor="mov-note">Note (facoltativo)</label>
                  <textarea id="mov-note" name="note" rows={2} placeholder="Aggiungi un dettaglio…"
                    value={descrizione} onChange={(e) => setDescrizione(e.target.value)}
                  />
                </div>

                <div className="mov-modal-actions">
                  <a href="#" className="mov-btn-secondary" onClick={() => setModalAperto(false)}>Annulla</a>
                  <button type="submit" className="mov-btn-primary" onClick={salvaMovimento}>Salva movimento</button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </main >
  );
}
