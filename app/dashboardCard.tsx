"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";
import { iconaMovimento, type Movimento, coloreMovimento } from "@/components/iconeMovimenti";
import GraficoVariazione from "@/components/GraficoVariazione";


export default function DashboardCard({ username }: { username: string }) {

  const [conti, setConti] = useState<Conto[]>([]);
  const [movimenti, setMovimenti] = useState<Movimento[]>([]);
  const [storicoPatrimonio, setStoricoPatrimonio] = useState<
    { saldo_totale: number; created_at: string }[]
  >([]);

  const [filtroData, setFiltroData] = useState("mese");
  const oggi = new Date();
  const meseCorrente = oggi.getMonth();
  const annoCorrente = oggi.getFullYear();
  const inizioAnno = new Date(annoCorrente, 0, 1);
  const inizioMese = new Date(annoCorrente, meseCorrente, 1);

  const ultimiMovimenti = [...movimenti]
    .sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();

      if (dataA !== dataB) return dataB - dataA;

      return new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime();
    })
    .slice(0, 5);

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


  function calcoloPatrimonio() {
    return conti
      .filter(conto => conto.includi_patrimonio)
      .reduce((totale, conto) => totale + conto.Saldo, 0);
  }

  function calcolaVariazionePatrimonio(): {
    testo: string;
    freccia: "su" | "giu" | "nessuna";
  } {
    const oggi = new Date();

    const inizioMeseCorrente = new Date(
      oggi.getFullYear(),
      oggi.getMonth(),
      1
    );

    const storicoPrecedente = [...storicoPatrimonio]
      .reverse()
      .find(registrazione =>
        new Date(registrazione.created_at) < inizioMeseCorrente
      );

    if (!storicoPrecedente || storicoPrecedente.saldo_totale === 0) {
      return {
        testo: "—",
        freccia: "nessuna"
      };
    }

    const patrimonioAttuale = calcoloPatrimonio();
    const patrimonioPrecedente = Number(storicoPrecedente.saldo_totale);

    const variazione =
      ((patrimonioAttuale - patrimonioPrecedente) /
        Math.abs(patrimonioPrecedente)) * 100;

    return {
      testo: `${variazione > 0 ? "+" : ""}${variazione
        .toFixed(1)
        .replace(".", ",")}%`,
      freccia: variazione > 0
        ? "su"
        : variazione < 0
          ? "giu"
          : "nessuna"
    };
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

  //Inserimento importo Entrate - Uscite
  function inserimentoImporto() {
    if ((calcoloEntrate() - calcoloUscite()) < 0) {
      return `− € ${Math.abs(calcoloEntrate() - calcoloUscite()).toFixed(2)}`;
    } else if ((calcoloEntrate() - calcoloUscite()) > 0) {
      return `+ € ${(calcoloEntrate() - calcoloUscite()).toFixed(2)}`;
    } else if ((calcoloEntrate() - calcoloUscite()) == 0) {
      return `€ ${(calcoloEntrate() - calcoloUscite()).toFixed(2)}`;
    }
  }

  function inserimentoImportoMovimenti(movimento: Movimento) {
    if (movimento.tipo === "uscita") {
      return `− € ${movimento.importo.toFixed(2)}`;
    } else if (movimento.tipo === "entrata") {
      return `+ € ${movimento.importo.toFixed(2)}`;
    } else if (movimento.tipo === "trasferimento") {
      return `€ ${movimento.importo.toFixed(2)}`;
    }
  }

  function percentualeCategoria(categoria: string) {
    const oggi = new Date();

    const movimentiPeriodo = movimenti.filter(movimento => {
      if (movimento.tipo !== "uscita") return false;

      const data = new Date(movimento.data);

      if (filtroData === "settimana") {
        const inizioSettimana = new Date();
        inizioSettimana.setDate(oggi.getDate() - 6);
        inizioSettimana.setHours(0, 0, 0, 0);

        return data >= inizioSettimana;
      }

      if (filtroData === "mese") {
        return (
          data >= inizioMese &&
          data.getFullYear() === annoCorrente
        );
      }

      if (filtroData === "anno") {
        return data >= inizioAnno;
      }

      return false;
    });

    const totaleUscite = movimentiPeriodo.reduce(
      (acc, movimento) => acc + movimento.importo,
      0
    );

    const totaleCategoria = movimentiPeriodo
      .filter(movimento => movimento.categoria === categoria)
      .reduce((acc, movimento) => acc + movimento.importo, 0);

    if (totaleUscite === 0) return 0;

    return (totaleCategoria / totaleUscite) * 100;
  }

  const categorieSpese = [
    { nome: "Casa", colore: "#c18a00" },
    { nome: "Alimentari", colore: "#0c884a" },
    { nome: "Trasporti", colore: "#3b6fe0" },
    { nome: "Svago", colore: "#8b5cf6" },
    { nome: "Salute", colore: "#9f130e" },
    { nome: "Viaggi", colore: "#079bb5" },
    { nome: "Ristorazione", colore: "#d17d00" },
    { nome: "Altro", colore: "#64748b" }
  ];

  const circonferenza = 2 * Math.PI * 46;

  let arcoPrecedente = 0;

  const datiCiambella = categorieSpese.map(categoria => {
    const percentuale = percentualeCategoria(categoria.nome);
    const lunghezza = circonferenza * percentuale / 100;

    const dato = {
      ...categoria,
      percentuale,
      lunghezza,
      offset: -arcoPrecedente
    };

    arcoPrecedente += lunghezza;

    return dato;
  });

  const oggiGrafico = new Date();

  const mesiGrafico = Array.from({ length: 6 }, (_, i) => {
    const data = new Date(
      oggiGrafico.getFullYear(),
      oggiGrafico.getMonth() - 5 + i,
      1
    );

    const anno = data.getFullYear();
    const mese = data.getMonth();

    const movimentiMese = movimenti.filter(movimento => {
      const dataMovimento = new Date(movimento.data);

      return (
        dataMovimento.getFullYear() === anno &&
        dataMovimento.getMonth() === mese
      );
    });

    const entrate = movimentiMese
      .filter(m => m.tipo === "entrata")
      .reduce((totale, m) => totale + m.importo, 0);

    const uscite = movimentiMese
      .filter(m => m.tipo === "uscita")
      .reduce((totale, m) => totale + m.importo, 0);

    return {
      nome: data.toLocaleDateString("it-IT", { month: "short" }),
      entrate,
      uscite
    };
  });

  const massimoGrafico = Math.max(
    ...mesiGrafico.flatMap(m => [m.entrate, m.uscite]),
    1
  );

  const massimoScala = Math.ceil(massimoGrafico / 1000) * 1000 || 1000;
  const metaScala = massimoScala / 2;

  function intervalloPeriodo() {
    const oggi = new Date();
    const inizio = new Date(oggi);
    inizio.setHours(0, 0, 0, 0);

    const fine = new Date(oggi);
    fine.setHours(23, 59, 59, 999);

    if (filtroData === "settimana") {
      inizio.setDate(inizio.getDate() - 6);

      const inizioPrecedente = new Date(inizio);
      inizioPrecedente.setDate(inizioPrecedente.getDate() - 7);

      const finePrecedente = new Date(inizio);
      finePrecedente.setMilliseconds(-1);

      return { inizio, fine, inizioPrecedente, finePrecedente };
    }

    if (filtroData === "mese") {
      const inizioMese = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
      const inizioMesePrecedente = new Date(
        oggi.getFullYear(),
        oggi.getMonth() - 1,
        1
      );

      const fineMesePrecedente = new Date(inizioMese.getTime() - 1);

      return {
        inizio: inizioMese,
        fine,
        inizioPrecedente: inizioMesePrecedente,
        finePrecedente: fineMesePrecedente
      };
    }

    const inizioAnno = new Date(oggi.getFullYear(), 0, 1);
    const inizioAnnoPrecedente = new Date(oggi.getFullYear() - 1, 0, 1);
    const fineAnnoPrecedente = new Date(inizioAnno.getTime() - 1);

    return {
      inizio: inizioAnno,
      fine,
      inizioPrecedente: inizioAnnoPrecedente,
      finePrecedente: fineAnnoPrecedente
    };
  }

  function totaleMovimenti(
    tipo: "entrata" | "uscita",
    inizio: Date,
    fine: Date
  ) {
    return movimenti
      .filter(m => {
        const data = new Date(m.data);

        return (
          m.tipo === tipo &&
          data >= inizio &&
          data <= fine
        );
      })
      .reduce((totale, m) => totale + m.importo, 0);
  }

  function calcolaVariazione(tipo: "entrata" | "uscita" | "risparmio") {
    const periodo = intervalloPeriodo();

    const entrateAttuali = totaleMovimenti(
      "entrata", periodo.inizio, periodo.fine
    );
    const usciteAttuali = totaleMovimenti(
      "uscita", periodo.inizio, periodo.fine
    );

    const entratePrecedenti = totaleMovimenti(
      "entrata", periodo.inizioPrecedente, periodo.finePrecedente
    );
    const uscitePrecedenti = totaleMovimenti(
      "uscita", periodo.inizioPrecedente, periodo.finePrecedente
    );

    let attuale = 0;
    let precedente = 0;

    if (tipo === "entrata") {
      attuale = entrateAttuali;
      precedente = entratePrecedenti;
    } else if (tipo === "uscita") {
      attuale = usciteAttuali;
      precedente = uscitePrecedenti;
    } else {
      attuale = entrateAttuali - usciteAttuali;
      precedente = entratePrecedenti - uscitePrecedenti;
    }

    if (precedente === 0) {
      return {
        testo: "—",
        favorevole: true,
        positivo: true,
        andamento: "nessuna" as const
      };
    }

    const variazione = ((attuale - precedente) / Math.abs(precedente)) * 100;

    return {
      testo: `${variazione > 0 ? "+" : ""}${variazione.toFixed(1).replace(".", ",")}%`,
      positivo: variazione > 0,
      favorevole: tipo === "uscita" ? variazione <= 0 : variazione >= 0,
      andamento: variazione > 0
        ? "su" as const
        : variazione < 0
          ? "giu" as const
          : "nessuna" as const
    };
  }

  // Recuperiamo i conti da Supabase
  useEffect(() => {
    async function caricaConti() {
      // Recuperiamo i conti da Supabase
      const { data, error } = await supabase
        .from("conti")
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      setConti(data)
    }

    caricaConti();
  }, []);

  // Recuperiamo i movimenti da Supabase
  useEffect(() => {
    async function caricaMovimenti() {
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


  useEffect(() => {
    async function caricaStorico() {
      const { data, error } = await supabase
        .from("patrimonio_storico")
        .select("saldo_totale, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setStoricoPatrimonio(data ?? []);
    }

    caricaStorico();
  }, []);

  return (
    <div className="dash">
      {/* ============================ Intestazione ============================ */}
      <header className="dash-header">
        <div>
          {/* TODO JS: saluto in base all'ora (Buongiorno / Buon pomeriggio / Buonasera) */}
          <h1 className="dash-title">Benvenuto, {username}</h1>
          <p className="dash-subtitle">Ecco la panoramica delle tue finanze oggi.</p>
        </div>

        <div className="dash-actions">
          <div className="dash-seg" role="group" aria-label="Periodo">
            <button type="button" className={filtroData === "settimana" ? "on" : ""} onClick={() => setFiltroData("settimana")}>Settimana</button>
            <button type="button" className={filtroData === "mese" ? "on" : ""} aria-pressed="true" onClick={() => setFiltroData("mese")}>Mese</button>
            <button type="button" className={filtroData === "anno" ? "on" : ""} onClick={() => setFiltroData("anno")}>Anno</button>
          </div>

          {/* TODO JS: nascondi / mostra importi (aria-pressed + sostituire gli importi con € ••••) */}
          <button type="button" className="dash-icon-btn" aria-label="Nascondi importi" aria-pressed="false">
            <svg className="dash-ic" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </button>

        </div>
      </header>

      {/* ========================== Messaggio utile =========================== TODO
      <div className="dash-insight">
        <p>Hai speso il 12% in meno rispetto al mese scorso: ottimo lavoro. Il budget Svago è però al 92%.</p>
      </div>
      */}

      {/* ========================== Card riepilogo ============================ */}
      <section className="dash-kpis" aria-label="Riepilogo">
        {/* Saldo totale */}
        <div className="dash-card dash-hero lift">
          <div>
            <div className="dash-hero-label">
              <svg className="dash-ic" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M3 7a2 2 0 012-2h13v4M3 7v11a2 2 0 002 2h15V9H5a2 2 0 01-2-2zM16 14.5h.01" />
              </svg>
              Saldo totale
            </div>
            <div className="dash-hero-value">€ {calcoloPatrimonio().toFixed(2)}</div>
            <div className="dash-hero-badge">
              {calcolaVariazionePatrimonio().freccia === "su" && (
                <svg className="dash-ic" viewBox="0 0 24 24"
                  width="14" height="14" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              )}

              {calcolaVariazionePatrimonio().freccia === "giu" && (
                <svg className="dash-ic" viewBox="0 0 24 24"
                  width="14" height="14" aria-hidden="true">
                  <path d="M7 7L17 17M9 17h8V9" />
                </svg>
              )}
              {calcolaVariazionePatrimonio().testo} rispetto al mese precedente
            </div>
          </div>
          <GraficoVariazione
            andamento={calcolaVariazionePatrimonio().freccia}
            width={200}
            height={50}
            className="dash-hero-spark"
            coloreStatico={true}
          />
        </div>

        {/* Entrate */}
        <div className="dash-card dash-kpi lift">
          <div className="dash-kpi-top">
            <span>Entrate</span>
            <span className="dash-chip pos">
              <svg className="dash-ic" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
              </svg>
            </span>
          </div>
          <div className="dash-kpi-value">€ {calcoloEntrate().toFixed(2)}</div>
          <div className="dash-kpi-delta">
            <span className={`dash-badge ${calcolaVariazione("entrata").favorevole ? "pos" : "neg"}`}>
              {calcolaVariazione("entrata").testo}
            </span>
            <span className="dash-muted">vs periodo prec.</span>
          </div>
          <GraficoVariazione
            andamento={calcolaVariazione("entrata").andamento}
            width="100%"
            height={40}
          />
        </div>

        {/* Uscite */}
        <div className="dash-card dash-kpi lift">
          <div className="dash-kpi-top">
            <span>Uscite</span>
            <span className="dash-chip warn">
              <svg className="dash-ic" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M3 7l6 6 4-4 8 8M15 17h6v-6" />
              </svg>
            </span>
          </div>
          <div className="dash-kpi-value">€ {calcoloUscite().toFixed(2)}</div>
          <div className="dash-kpi-delta">
            <span className={`dash-badge ${calcolaVariazione("uscita").favorevole ? "pos" : "neg"}`}>
              {calcolaVariazione("uscita").testo}
            </span>
            <span className="dash-muted">vs periodo prec.</span>
          </div>
          <GraficoVariazione
            andamento={
              calcolaVariazione("uscita").andamento === "su"
                ? "giu"
                : calcolaVariazione("uscita").andamento === "giu"
                  ? "su"
                  : "nessuna"
            }
            width="100%"
            height={40}
          />
        </div>

        {/* Risparmio */}
        <div className="dash-card dash-kpi lift">
          <div className="dash-kpi-top">
            <span>Risparmio</span>
            <span className="dash-chip info">
              <svg className="dash-ic" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </span>
          </div>
          <div className="dash-kpi-value">€ {(calcoloEntrate() - calcoloUscite()).toFixed(2)}</div>
          <div className="dash-kpi-delta">
            <span className={`dash-badge ${calcolaVariazione("risparmio").favorevole ? "pos" : "neg"}`}>
              {calcolaVariazione("risparmio").testo}
            </span>
            <span className="dash-muted">vs periodo prec.</span>
          </div>
          <GraficoVariazione
            andamento={calcolaVariazione("risparmio").andamento}
            width="100%"
            height={40}
          />
        </div>
      </section>

      {/* ============================== Grafici =============================== */}
      <section className="dash-row">
        {/* ---------- Entrate e Uscite (barre) ---------- */}
        <div className="dash-card dash-panel dash-wide">
          <div className="dash-panel-head">
            <div>
              <h2>Entrate e Uscite</h2>
              <p className="dash-muted">
                Netto del periodo: <strong className={`dash-amt ${(calcoloEntrate() - calcoloUscite()) > 0 ? "pos" : (calcoloEntrate() - calcoloUscite()) < 0 ? "neg" : "neutral"}`}>{inserimentoImporto()}</strong>
              </p>
            </div>
            <div className="dash-legend-inline">
              <span><i style={{ background: "var(--bar-in)" }} />Entrate</span>
              <span><i style={{ background: "var(--bar-out)" }} />Uscite</span>
            </div>
          </div>

          <div className="dash-chart">
            <div className="dash-gridlines" aria-hidden="true">
              <div className="dash-gridline" style={{ top: "0%" }}>
                <span>{(massimoScala / 1000).toFixed(0)}k</span>
              </div>

              <div className="dash-gridline" style={{ top: "50%" }}>
                <span>{(metaScala / 1000).toFixed(1)}k</span>
              </div>

              <div className="dash-gridline" style={{ top: "100%" }}>
                <span>0</span>
              </div>
            </div>

            {/* Per ogni colonna: height = importo / 4000 * 100 (in %) */}
            <div className="dash-cols">
              {mesiGrafico.map(mese => {
                const altezzaEntrate = (mese.entrate / massimoGrafico) * 100;
                const altezzaUscite = (mese.uscite / massimoGrafico) * 100;

                return (
                  <div className="dash-col" tabIndex={0} key={mese.nome}>
                    <div className="dash-tip">
                      <strong>{mese.nome}</strong>
                      <br />
                      Entrate € {mese.entrate.toFixed(2)}
                      <br />
                      Uscite € {mese.uscite.toFixed(2)}
                    </div>

                    <div className="dash-bars">
                      <div
                        className="dash-bar in"
                        style={{ height: `${altezzaEntrate}%` }}
                      />
                      <div
                        className="dash-bar out"
                        style={{ height: `${altezzaUscite}%` }}
                      />
                    </div>

                    <span className="dash-col-label">{mese.nome}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---------- Spese per categoria (ciambella) ---------- */}
        <div className="dash-card dash-panel dash-narrow">
          <h2>Spese per categoria</h2>
          {/*<p className="dash-muted">Tocca una categoria per metterla a fuoco</p> TODO */}

          <div className="dash-donut-wrap">
            <div className="dash-donut">
              {/* Ogni arco: strokeDasharray = "lunghezza 289.03", strokeDashoffset = - somma degli archi precedenti */}
              <svg viewBox="0 0 120 120" width="176" height="176" role="img" aria-label="Grafico a ciambella delle spese per categoria">
                <g transform="rotate(-90 60 60)">
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    style={{
                      fill: "none",
                      stroke: "var(--chip)",
                      strokeWidth: 12
                    }}
                  />

                  {datiCiambella.map(categoria => (
                    <circle
                      key={categoria.nome}
                      cx="60"
                      cy="60"
                      r="46"
                      style={{
                        fill: "none",
                        stroke: categoria.colore,
                        strokeWidth: 12,
                        strokeDasharray: `${categoria.lunghezza} ${circonferenza}`,
                        strokeDashoffset: categoria.offset
                      }}
                    />
                  ))}
                </g>
              </svg>
              <div className="dash-donut-center">
                <span className="dash-muted">Uscite</span>
                <strong>€ {calcoloUscite().toFixed(2)}</strong>
              </div>
            </div>

            <div className="dash-legend">
              {datiCiambella.map(categoria => (
                <button
                  type="button"
                  className="dash-leg"
                  key={categoria.nome}
                  aria-pressed="false"
                >
                  <i style={{ background: categoria.colore }} />
                  <span>{categoria.nome}</span>
                  <span className="dash-muted">
                    {categoria.percentuale.toFixed(1)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== Movimenti, budget, obiettivi ================== */}
      <section className="dash-row top">

        {/* ---------- Ultimi movimenti ---------- */}
        <div className="dash-card dash-panel dash-wide">
          <div className="dash-panel-head">
            <h2>Ultimi movimenti</h2>
            <a href="/movimenti" className="dash-link">Vedi tutti</a>
          </div>

          <div className="dash-tx-list">
            {ultimiMovimenti.map(movimento => (
              <div className="dash-tx" key={movimento.id}>
                <span className={`mov-chip ${coloreMovimento(movimento)}`}>
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                    className="mov-ic"
                  >
                    <path d={iconaMovimento(movimento)} />
                  </svg>
                </span>
                <div className="dash-tx-text">
                  <strong>{movimento.nome}</strong>
                  <span className="dash-muted">Entrata · Oggi</span>
                </div>
                <span className={`dash-amt ${movimento.tipo === "entrata" ? "pos" : movimento.tipo === "uscita" ? "neg" : "transfer"}`}>{inserimentoImportoMovimenti(movimento)}</span>
              </div>
            ))}
            {/* ===== FINE RIGA MOVIMENTO ===== */}
          </div>
        </div>

        <div className="dash-narrow dash-stack">
          {/* ---------- Budget ---------- 
          <div className="dash-card dash-panel">
            <div className="dash-panel-head">
              <h2>Budget</h2>
              <a href="/budget" className="dash-link">Gestisci</a>
            </div>

            {// Classi dello stato: "ok" (< 85%), "warn" (≥ 85%), "over" (> 100%) //}
            <div className="dash-budgets">
              {// ===== BLOCCO BUDGET: copia per ogni budget ===== //}
              <div>
                <div className="dash-budget-head">
                  <span>Alimentari</span>
                  <span className="dash-muted">€ 312,00 / € 400,00</span>
                </div>
                <div className="dash-track" role="img" aria-label="Alimentari: 78% del budget utilizzato">
                  <div className="dash-fill ok" style={{ width: "78%" }} />
                </div>
                <div className="dash-status ok">78% · In linea</div>
              </div>
              {// ===== FINE BLOCCO BUDGET ===== //}

              <div>
                <div className="dash-budget-head">
                  <span>Svago</span>
                  <span className="dash-muted">€ 138,00 / € 150,00</span>
                </div>
                <div className="dash-track" role="img" aria-label="Svago: 92% del budget utilizzato">
                  <div className="dash-fill warn" style={{ width: "92%" }} />
                </div>
                <div className="dash-status warn">92% · Quasi al limite</div>
              </div>

              <div>
                <div className="dash-budget-head">
                  <span>Trasporti</span>
                  <span className="dash-muted">€ 54,00 / € 120,00</span>
                </div>
                <div className="dash-track" role="img" aria-label="Trasporti: 45% del budget utilizzato">
                  <div className="dash-fill ok" style={{ width: "45%" }} />
                </div>
                <div className="dash-status ok">45% · In linea</div>
              </div>

              <div>
                <div className="dash-budget-head">
                  <span>Abbonamenti</span>
                  <span className="dash-muted">€ 46,00 / € 40,00</span>
                </div>
                <div className="dash-track" role="img" aria-label="Abbonamenti: 115% del budget utilizzato">
                  <div className="dash-fill over" style={{ width: "100%" }} />
                </div>
                <div className="dash-status over">115% · Superato di € 6,00</div>
              </div>
            </div>
          </div>*/}

          {/* Obiettivi di risparmio TODO
          <div className="dash-card dash-panel">
            <h2>Obiettivi di risparmio</h2>

            <div className="dash-goals">
              <div className="dash-goal">
                <div className="dash-goal-ring">
                  <svg viewBox="0 0 84 84" width="84" height="84" role="img" aria-label="Vacanza: 65% raggiunto">
                    <g transform="rotate(-90 42 42)">
                      <circle cx="42" cy="42" r="34" style={{ fill: "none", stroke: "var(--chip)", strokeWidth: 8 }} />
                      <circle cx="42" cy="42" r="34" style={{ fill: "none", stroke: "#3B6FE0", strokeWidth: 8, strokeLinecap: "round", strokeDasharray: "138.86 213.63" }} />
                    </g>
                  </svg>
                  <span>65%</span>
                </div>
                <strong>Vacanza</strong>
                <span className="dash-muted">€ 1.300,00 di € 2.000,00</span>
              </div>
              {// ===== FINE BLOCCO OBIETTIVO ===== //}

              <div className="dash-goal">
                <div className="dash-goal-ring">
                  <svg viewBox="0 0 84 84" width="84" height="84" role="img" aria-label="Fondo emergenza: 40% raggiunto">
                    <g transform="rotate(-90 42 42)">
                      <circle cx="42" cy="42" r="34" style={{ fill: "none", stroke: "var(--chip)", strokeWidth: 8 }} />
                      <circle cx="42" cy="42" r="34" style={{ fill: "none", stroke: "#0E9F6E", strokeWidth: 8, strokeLinecap: "round", strokeDasharray: "85.45 213.63" }} />
                    </g>
                  </svg>
                  <span>40%</span>
                </div>
                <strong>Fondo emergenza</strong>
                <span className="dash-muted">€ 2.400,00 di € 6.000,00</span>
              </div>

              <div className="dash-goal">
                <div className="dash-goal-ring">
                  <svg viewBox="0 0 84 84" width="84" height="84" role="img" aria-label="Auto nuova: 22% raggiunto">
                    <g transform="rotate(-90 42 42)">
                      <circle cx="42" cy="42" r="34" style={{ fill: "none", stroke: "var(--chip)", strokeWidth: 8 }} />
                      <circle cx="42" cy="42" r="34" style={{ fill: "none", stroke: "#8B5CF6", strokeWidth: 8, strokeLinecap: "round", strokeDasharray: "47.00 213.63" }} />
                    </g>
                  </svg>
                  <span>22%</span>
                </div>
                <strong>Auto nuova</strong>
                <span className="dash-muted">€ 3.300,00 di € 15.000,00</span>
              </div>
            </div>
          </div>*/}

        </div>
      </section>
    </div>
  );
}
