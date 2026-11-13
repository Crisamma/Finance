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
    categoria: string;
    tipo: string;
    importo: number;
    data: Date;
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
        categoria: categoria,
        tipo: tipo,
        data: data
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
          categoria: categoria,
          tipo: tipo,
          data: data
          //created_at: created_at,
        })
        .eq("id", movimentoSelezionato);

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
            categoria: categoria,
            tipo: tipo,
            data: data
          };
        }

        return movimento;
      }));
    }

    console.log("Movimento salvato!");
    setModalAperto(false);
  }

  function modificaMovimento(movimento: Movimento) {
    setMovimentoSelezionato(movimento.id);

    setNome(movimento.nome);
    setDescrizione(movimento.descrizione);
    setCategoria(movimento.categoria);
    setTipo(movimento.tipo);
    setImporto(movimento.importo);
    setData(new Date(movimento.data));
    setContoId(movimento.conto_id);

    setModalMode("modifica")
    setModalAperto(true)
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

  function inserimentoImporto(movimento: Movimento) {
    if (movimento.tipo === "uscita") {
      return `− € ${movimento.importo.toFixed(2)}`;
    } else if (movimento.tipo === "entrata") {
      return `+ € ${movimento.importo.toFixed(2)}`;
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
              <a href="#" className="mov-btn-secondary">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
                </svg>
                Esporta
              </a>
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
                <span>Entrate</span>
                <span className="mov-chip pos">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                    <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
                  </svg>
                </span>
              </div>
              <div className="mov-stat-value">€ 3.200,00</div>
              <span className="mov-badge pos">+5,1% vs mese prec.</span>
            </div>

            <div className="mov-stat">
              <div className="mov-stat-top">
                <span>Uscite</span>
                <span className="mov-chip warn">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                    <path d="M3 7l6 6 4-4 8 8M15 17h6v-6" />
                  </svg>
                </span>
              </div>
              <div className="mov-stat-value">€ 2.118,40</div>
              <span className="mov-badge pos">−12,0% vs mese prec.</span>
            </div>

            <div className="mov-stat mov-stat-net">
              <div className="mov-stat-top">
                <span>Saldo netto</span>
                <span className="mov-chip info">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                    <path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </span>
              </div>
              <div className="mov-stat-value">+ € 1.081,60</div>
              <span className="mov-muted">Novembre 2026</span>
            </div>
          </section>

          {/* Barra filtri (solo grafica) */}
          <form className="mov-toolbar" role="search" aria-label="Filtra i movimenti">
            <div className="mov-search">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                <path d="M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-4.3-4.3" />
              </svg>
              <label htmlFor="mov-cerca" className="mov-sr">Cerca un movimento</label>
              <input id="mov-cerca" name="q" type="search" placeholder="Cerca per descrizione…" />
            </div>

            <div className="mov-select">
              <label htmlFor="mov-f-conto" className="mov-sr">Conto</label>
              <select id="mov-f-conto" name="conto">
                <option value="">Tutti i conti</option>
                <option value="principale">Conto principale</option>
                <option value="risparmio">Conto risparmio</option>
                <option value="carta">Carta di credito</option>
                <option value="contanti">Contanti</option>
              </select>
            </div>

            <div className="mov-select">
              <label htmlFor="mov-f-cat" className="mov-sr">Categoria</label>
              <select id="mov-f-cat" name="categoria">
                <option value="">Tutte le categorie</option>
                <option value="casa">Casa</option>
                <option value="alimentari">Alimentari</option>
                <option value="trasporti">Trasporti</option>
                <option value="svago">Svago</option>
                <option value="salute">Salute</option>
                <option value="altro">Altro</option>
              </select>
            </div>

            <div className="mov-select">
              <label htmlFor="mov-f-periodo" className="mov-sr">Periodo</label>
              <select id="mov-f-periodo" name="periodo">
                <option value="settimana">Ultimi 7 giorni</option>
                <option value="mese">Questo mese</option>
                <option value="mese-prec">Mese scorso</option>
                <option value="anno">Quest&apos;anno</option>
              </select>
            </div>
          </form>

          <nav className="mov-filters" aria-label="Filtra per tipo di movimento">
            <a href="#" className="mov-pill on" aria-current="true">Tutti</a>
            <a href="#" className="mov-pill">Entrate</a>
            <a href="#" className="mov-pill">Uscite</a>
            <a href="#" className="mov-pill">Trasferimenti</a>
          </nav>

          {/* Elenco movimenti */}
          <section className="mov-list" aria-label="Elenco movimenti" ref={menuRef}>
            <div className="mov-head" aria-hidden="true">
              <span />
              <span>Descrizione</span>
              <span>Categoria</span>
              <span>Conto</span>
              <span className="r">Importo</span>
            </div>

            {/* ---------- Oggi ---------- */}
            <h2 className="mov-day">Oggi · 10 novembre</h2>

            {/* ===== RIGA MOVIMENTO: copia questo blocco per ogni movimento ===== */}
            {movimenti.map((movimento) => (
              <div className="mov-row" key={movimento.id}>
                <span className="mov-chip pos">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                    <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
                  </svg>
                </span>
                <div className="mov-desc">
                  <strong>{movimento.nome}</strong>
                  <span>{movimento.descrizione} · </span> {/* inserire movimento.conto */}
                </div>
                <span className="mov-cat"><i className="c-verde" />{movimento.categoria}</span>
                <span className="mov-acc">{conti.find((conto) => conto.id === movimento.conto_id)?.Nome}</span>
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
        <a href="#modifica-movimento" onClick={(e) => {
          e.preventDefault();
          modificaMovimento(movimento);
          setMenuAperto(null);
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="mov-ic">
            <path d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16zM13.5 6.5l4 4" />
          </svg>
          Modifica
        </a>

        <a href="#elimina-movimento" className="danger" onClick={(e) => {
          e.preventDefault();
          eliminaMovimento(movimento.id);
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="mov-ic">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
          </svg>
          Elimina
        </a>
      </div>
    )}
  </div>
</div>
              </div>
            ))}
            {/* ===== FINE RIGA MOVIMENTO ===== */}

            <div className="mov-row">
              <span className="mov-chip warn">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M3 4h2l2.4 11h10.2l2-8H6.2M9 20a1 1 0 100-2 1 1 0 000 2M17 20a1 1 0 100-2 1 1 0 000 2" />
                </svg>
              </span>
              <div className="mov-desc">
                <strong>Esselunga</strong>
                <span>Alimentari · Carta di credito</span>
              </div>
              <span className="mov-cat"><i className="c-verde" />Alimentari</span>
              <span className="mov-acc">Carta di credito</span>
              <span className="mov-amt">− € 64,20</span>
            </div>

            <div className="mov-row">
              <span className="mov-chip">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M4 7h16v12H4zM9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M4 13h16" />
                </svg>
              </span>
              <div className="mov-desc">
                <strong>Caffè e cornetto</strong>
                <span>Altro · Contanti</span>
              </div>
              <span className="mov-cat"><i className="c-grigio" />Altro</span>
              <span className="mov-acc">Contanti</span>
              <span className="mov-amt">− € 2,40</span>
            </div>

            {/* ---------- Ieri ---------- */}
            <h2 className="mov-day">Ieri · 9 novembre</h2>

            <div className="mov-row">
              <span className="mov-chip neutral">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4" />
                </svg>
              </span>
              <div className="mov-desc">
                <strong>Trasferimento al risparmio</strong>
                <span>Trasferimento · Conto principale → Conto risparmio</span>
              </div>
              <span className="mov-cat"><i className="c-blu" />Trasferimento</span>
              <span className="mov-acc">Principale → Risparmio</span>
              <span className="mov-amt neutral">€ 300,00</span>
            </div>

            <div className="mov-row">
              <span className="mov-chip vio">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <div className="mov-desc">
                <strong>Netflix</strong>
                <span>Svago · Carta di credito</span>
              </div>
              <span className="mov-cat"><i className="c-viola" />Svago</span>
              <span className="mov-acc">Carta di credito</span>
              <span className="mov-amt">− € 12,99</span>
            </div>

            {/* ---------- Venerdì 7 novembre ---------- */}
            <h2 className="mov-day">Venerdì · 7 novembre</h2>

            <div className="mov-row">
              <span className="mov-chip info">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />
                </svg>
              </span>
              <div className="mov-desc">
                <strong>Affitto novembre</strong>
                <span>Casa · Conto principale</span>
              </div>
              <span className="mov-cat"><i className="c-blu" />Casa</span>
              <span className="mov-acc">Conto principale</span>
              <span className="mov-amt">− € 720,00</span>
            </div>

            <div className="mov-row">
              <span className="mov-chip">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M7 3h10a2 2 0 012 2v10a3 3 0 01-3 3H8a3 3 0 01-3-3V5a2 2 0 012-2zM5 11h14M8 21l2-3M16 21l-2-3" />
                </svg>
              </span>
              <div className="mov-desc">
                <strong>Trenitalia</strong>
                <span>Trasporti · Conto principale</span>
              </div>
              <span className="mov-cat"><i className="c-arancio" />Trasporti</span>
              <span className="mov-acc">Conto principale</span>
              <span className="mov-amt">− € 38,50</span>
            </div>

            <div className="mov-row">
              <span className="mov-chip pos">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z" />
                </svg>
              </span>
              <div className="mov-desc">
                <strong>Farmacia</strong>
                <span>Salute · Carta di credito</span>
              </div>
              <span className="mov-cat"><i className="c-verde" />Salute</span>
              <span className="mov-acc">Carta di credito</span>
              <span className="mov-amt">− € 18,70</span>
            </div>
          </section>

          {/* Paginazione (solo grafica) */}
          <nav className="mov-pager" aria-label="Paginazione">
            <span className="mov-muted">Mostro 1–8 di 48 movimenti</span>
            <div className="mov-pager-links">
              <a href="#" className="mov-page-btn disabled" aria-label="Pagina precedente" aria-disabled="true">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </a>
              <a href="#" className="mov-page-btn on" aria-current="page">1</a>
              <a href="#" className="mov-page-btn">2</a>
              <a href="#" className="mov-page-btn">3</a>
              <span className="mov-muted">…</span>
              <a href="#" className="mov-page-btn">6</a>
              <a href="#" className="mov-page-btn" aria-label="Pagina successiva">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="mov-ic">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Finestra "Nuova transazione" */}
      {modalAperto && (
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

                <input type="radio" name="tipo" id="tipo-uscita" value="uscita" defaultChecked onChange={(e) => setTipo(e.target.value)} />
                <label htmlFor="tipo-uscita">Uscita</label>

                <input type="radio" name="tipo" id="tipo-entrata" value="entrata" onChange={(e) => setTipo(e.target.value)} />
                <label htmlFor="tipo-entrata">Entrata</label>

                <input type="radio" name="tipo" id="tipo-trasf" value="trasferimento" onChange={(e) => setTipo(e.target.value)} />
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

              <div className="mov-field">
                <label htmlFor="mov-descrizione">Descrizione</label>
                <input id="mov-descrizione" name="descrizione" type="text" placeholder="Es. Spesa settimanale" required
                  value={nome} onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="mov-field-row">
                <div className="mov-field">
                  <label htmlFor="mov-categoria">Categoria</label>
                  <select id="mov-categoria" name="categoria"
                    value={categoria} onChange={(e) => setCategoria(e.target.value)}
                  >
                    <option value="casa">Casa</option>
                    <option value="alimentari">Alimentari</option>
                    <option value="trasporti">Trasporti</option>
                    <option value="svago">Svago</option>
                    <option value="salute">Salute</option>
                    <option value="altro">Altro</option>
                  </select>
                </div>
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
      )}
    </main>
  );
}
