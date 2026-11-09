"use client";
import { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import { createClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

/*
  Pagina CONTI: solo grafica, nessun JavaScript.
  - Dati di esempio scritti direttamente nel markup: andranno sostituiti con i dati reali.
  - La finestra "Nuovo conto" si apre/chiude solo con CSS (:target):
    il link href="#nuovo-conto-modal" la apre, href="#" la chiude.
  - Il form non è ancora collegato a nulla (TODO: salvataggio su Supabase).
*/

export default function Conti() {

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("corrente");
  const [valuta, setValuta] = useState("EUR");
  const [saldo, setSaldo] = useState(0);
  const [ultime4Cifre, setultime4Cifre] = useState("");
  const [colore, setColore] = useState("blu");
  const [includi, setIncludi] = useState(true);
  const [conti, setConti] = useState<Conto[]>([]);

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



  //const [created_at, setCreatedAt] = useState(now());

  //funzione per bottone Nuovo conto
  async function salvaConto() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("conti")
      .insert([{
        user_id: user.id,
        Nome: nome,
        Tipo: tipo,
        Valuta: valuta,
        Saldo: saldo,
        ultime_4_cifre: ultime4Cifre,
        colore: colore,
        includi_patrimonio: includi,
        //created_at: created_at,
      }]);


    if (error) {
      console.log("ID utente:", user?.id);
      console.error("Errore salvataggio conto:", error);
      return;
    }


    console.log("Pulsante premuto!");
  }

  function valutaConto(valutaConto: string) {
    let valutaCorrente = valutaConto;
    switch (valutaCorrente) {
      case "EUR":
        valutaCorrente = "€";
        break;

      case "Dollaro":
        valutaCorrente = "$";
        break;

      case "Sterlina":
        valutaCorrente = "£";
        break;

      case "Franco":
        valutaCorrente = "CHF";
        break;
      default:
        break;
    }
    return valutaCorrente;
  }

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
  return (

    <main className="min-h-screen bg-white">

      <Sidebar />

      <div className="main-content">
        <div className="conti-page">
          {/* Intestazione */}
          <header className="conti-header2">
            <div>
              <h1 className="conti-title">Conti</h1>
              <p className="conti-subtitle">Tutti i tuoi conti e i loro saldi in un unico posto.</p>
            </div>
            <a href="#nuovo-conto-modal" className="conti-btn-primary">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="conti-ic" style={{ strokeWidth: 2.4 }}>
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nuovo conto
            </a>
          </header>

          {/* Riepilogo */}
          <section className="conti-summary" aria-label="Riepilogo conti">
            <div className="conti-total">
              <div className="conti-total-label">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="conti-ic">
                  <path d="M3 7a2 2 0 012-2h13v4M3 7v11a2 2 0 002 2h15V9H5a2 2 0 01-2-2zM16 14.5h.01" />
                </svg>
                Patrimonio totale
              </div>
              <div className="conti-total-value">€ 9.100,45</div>
              <div className="conti-total-meta">5 conti attivi · aggiornato oggi</div>
            </div>

            <div className="conti-stat">
              <div className="conti-stat-top">
                <span>Liquidità</span>
                <span className="conti-chip pos">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="conti-ic">
                    <path d="M3 7a2 2 0 012-2h13v4M3 7v11a2 2 0 002 2h15V9H5a2 2 0 01-2-2z" />
                  </svg>
                </span>
              </div>
              <div className="conti-stat-value">€ 2.619,90</div>
              <div className="conti-stat-sub">Correnti, carte e contanti</div>
            </div>

            <div className="conti-stat">
              <div className="conti-stat-top">
                <span>Risparmi e investimenti</span>
                <span className="conti-chip info">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="conti-ic">
                    <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
                  </svg>
                </span>
              </div>
              <div className="conti-stat-value">€ 6.480,55</div>
              <div className="conti-stat-sub">71% del patrimonio</div>
            </div>
          </section>

          {/* Filtri (solo grafica) */}
          <nav className="conti-filters" aria-label="Filtra per tipo di conto">
            <a href="#" className="conti-pill on" aria-current="true">Tutti</a>
            <a href="#" className="conti-pill">Correnti</a>
            <a href="#" className="conti-pill">Risparmio</a>
            <a href="#" className="conti-pill">Carte</a>
            <a href="#" className="conti-pill">Contanti</a>
            <a href="#" className="conti-pill">Investimenti</a>
          </nav>

          {/* Griglia dei conti */}
          <section className="conti-grid" aria-label="Elenco conti">
            {/* Conto corrente */}
            {conti.map((conto) => (
              
            <article key={conto.id} className="conti-card">
              <div className="conti-card-top">
                <span className="conti-chip info">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="conti-ic">
                    <path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" />
                  </svg>
                </span>
                <div className="conti-card-name">
                  <h2>{conto.Nome}</h2>
                  <span>Conto corrente · •••• {conto.ultime_4_cifre}</span>
                </div>
                <button type="button" className="conti-more" aria-label="Opzioni conto principale">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="conti-ic">
                    <path d="M12 6h.01M12 12h.01M12 18h.01" style={{ strokeWidth: 3 }} />
                  </svg>
                </button>
              </div>
              <div className="conti-balance">{conto.Saldo} {valutaConto(conto.Valuta)}</div>
              <div className="conti-card-foot">
                <span className="conti-badge pos">+1,8% questo mese</span>
                <span className="conti-muted">Aggiornato oggi</span>
              </div>
              <svg viewBox="0 0 160 36" width="100%" height="36" preserveAspectRatio="none" aria-hidden="true" className="conti-spark">
                <polygon points="0,26 23,24 46,27 69,20 92,22 115,15 138,13 160,9 160,36 0,36" style={{ fill: "var(--pos-line)", fillOpacity: 0.12 }} />
                <polyline points="0,26 23,24 46,27 69,20 92,22 115,15 138,13 160,9" style={{ fill: "none", stroke: "var(--pos-line)", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }} vectorEffect="non-scaling-stroke" />
              </svg>
            </article>
            ))}

            {/* Card "aggiungi" */}
            <a href="#nuovo-conto-modal" className="conti-add">
              <span className="conti-add-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="conti-ic" style={{ strokeWidth: 2.2 }}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <strong>Aggiungi un conto</strong>
              <span className="conti-muted">Conto corrente, carta, contanti…</span>
            </a>
          </section>
        </div>
      </div>

      {/* Finestra "Nuovo conto": si apre con :target, nessun JavaScript */}
      <div id="nuovo-conto-modal" className="conti-modal" role="dialog" aria-modal="true" aria-labelledby="nuovo-conto-titolo">
        <a href="#" className="conti-modal-backdrop" aria-label="Chiudi finestra" tabIndex={-1} />

        <div className="conti-modal-box">
          <a href="#" className="conti-modal-close" aria-label="Chiudi">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="conti-ic">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </a>

          <h2 id="nuovo-conto-titolo" className="conti-modal-title">Nuovo conto</h2>
          <p className="conti-modal-sub">Aggiungi un conto per tenere traccia del suo saldo.</p>

          <form className="conti-form">
            <div className="conti-form-section">
              <h3>Informazioni</h3>

              <div className="conti-field">
                <label htmlFor="conto-nome">Nome del conto</label>
                <input
                  id="conto-nome" name="nome" type="text" placeholder="Es. Conto principale" required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="conti-field-row">
                <div className="conti-field">
                  <label htmlFor="conto-tipo">Tipo</label>
                  <select
                    id="conto-tipo" name="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="corrente">Conto corrente</option>
                    <option value="risparmio">Risparmio</option>
                    <option value="carta">Carta di credito</option>
                    <option value="contanti">Contanti</option>
                    <option value="investimenti">Investimenti</option>
                  </select>
                </div>
                <div className="conti-field">
                  <label htmlFor="conto-valuta">Valuta</label>
                  <select
                    id="conto-valuta" name="valuta"
                    value={valuta}
                    onChange={(e) => setValuta(e.target.value)}
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollaro ($)</option>
                    <option value="GBP">Sterlina (£)</option>
                    <option value="CHF">Franco (CHF)</option>
                  </select>
                </div>
              </div>

              <div className="conti-field-row">
                <div className="conti-field">
                  <label htmlFor="conto-saldo">Saldo iniziale</label>
                  <input
                    id="conto-saldo" name="saldo" type="number" step="0.01" placeholder="0,00"
                    value={saldo}
                    onChange={(e) => setSaldo(parseFloat(e.target.value))}
                  />
                </div>
                <div className="conti-field">
                  <label htmlFor="conto-iban">Ultime 4 cifre (facoltativo)</label>
                  <input
                    id="conto-iban" name="ultime4" type="text" inputMode="numeric" maxLength={4} placeholder="1234"
                    value={ultime4Cifre}
                    onChange={(e) => setultime4Cifre(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="conti-form-section">
              <h3>Aspetto</h3>
              <fieldset className="conti-swatches">
                <legend className="conti-sr">Colore del conto</legend>

                <input type="radio" name="colore" id="col-blu" value="blu" onChange={(e) => setColore(e.target.value)} />
                <label htmlFor="col-blu" className="sw blu"><span className="conti-sr">Blu</span></label>

                <input type="radio" name="colore" id="col-verde" value="verde" onChange={(e) => setColore(e.target.value)} />
                <label htmlFor="col-verde" className="sw verde"><span className="conti-sr">Verde</span></label>

                <input type="radio" name="colore" id="col-viola" value="viola" onChange={(e) => setColore(e.target.value)} />
                <label htmlFor="col-viola" className="sw viola"><span className="conti-sr">Viola</span></label>

                <input type="radio" name="colore" id="col-arancio" value="arancio" onChange={(e) => setColore(e.target.value)} />
                <label htmlFor="col-arancio" className="sw arancio"><span className="conti-sr">Arancione</span></label>

                <input type="radio" name="colore" id="col-grigio" value="grigio" onChange={(e) => setColore(e.target.value)} />
                <label htmlFor="col-grigio" className="sw grigio"><span className="conti-sr">Grigio</span></label>
              </fieldset>

              <label className="conti-switch" htmlFor="conto-includi">
                <input
                  id="conto-includi" name="includi" type="checkbox"
                  checked={includi}
                  onChange={(e) => setIncludi(e.target.checked)}
                />
                <span className="conti-switch-track" aria-hidden="true" />
                <span className="conti-switch-text">
                  <strong>Includi nel patrimonio totale</strong>
                  <span>Il saldo verrà sommato nel riepilogo della dashboard.</span>
                </span>
              </label>
            </div>

            <div className="conti-modal-actions">
              <a href="#" className="conti-btn-secondary">Annulla</a>
              <button onClick={salvaConto} type="submit" className="conti-btn-primary" >Salva conto</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
