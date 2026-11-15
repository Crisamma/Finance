"use client";
import Sidebar from "../sidebar";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";


export default function Impostazioni() {

  const router = useRouter();
  
  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Errore logout:", error);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white">
      <Sidebar />

      <div className="main-content">
        <div className="imp-page">
          {/* Intestazione */}
          <header className="imp-header">
            <div>
              <h1 className="imp-title">Impostazioni</h1>
              <p className="imp-subtitle">Gestisci il tuo profilo, le preferenze e la sicurezza dell&apos;account.</p>
            </div>
            {/* TODO: collegare al logout */}
            <button onClick={logout} className="imp-btn-secondary">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="imp-ic">
                <path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 8l-4 4 4 4M6 12h11" />
              </svg>
              Esci
            </button>
          </header>


          <div className="imp-content">
            {/* ============================ Profilo ============================ */}
            <section id="profilo" className="imp-card" aria-labelledby="imp-t-profilo">
              <div className="imp-card-head">
                <h2 id="imp-t-profilo">Profilo</h2>
                <p>Queste informazioni sono visibili solo a te.</p>
              </div>

              {/* TODO: collegare il salvataggio (es. Supabase) */}
              <form className="imp-form">
                <div className="imp-avatar-row">
                  <div className="imp-avatar" aria-hidden="true">M</div>
                  <div className="imp-avatar-actions">
                    <div className="imp-file">
                      <input id="imp-foto" name="foto" type="file" accept="image/*" />
                      <label htmlFor="imp-foto" className="imp-btn-secondary small">Cambia foto</label>
                    </div>
                    <span className="imp-hint">JPG o PNG, massimo 2 MB.</span>
                  </div>
                </div>

                <div className="imp-field-row">
                  <div className="imp-field">
                    <label htmlFor="imp-nome">Username</label>
                    <input id="imp-nome" name="nome" type="text" autoComplete="given-name" defaultValue="Mario" />
                  </div>
                </div>

                <div className="imp-field">
                  <label htmlFor="imp-email">Email</label>
                  <input id="imp-email" name="email" type="email" autoComplete="email" defaultValue="nome@esempio.it" />
                  <span className="imp-hint">Se la cambi, riceverai un&apos;email di conferma al nuovo indirizzo.</span>
                </div>

                <div className="imp-actions">
                  <button type="submit" className="imp-btn-primary">Salva profilo</button>
                </div>
              </form>
            </section>

            {/* ========================== Preferenze ===========================  TODO
              <section id="preferenze" className="imp-card" aria-labelledby="imp-t-preferenze">
                <div className="imp-card-head">
                  <h2 id="imp-t-preferenze">Preferenze</h2>
                  <p>Scegli come vuoi vedere importi e date.</p>
                </div>

                <form className="imp-form">
                  <div className="imp-field-row">
                    <div className="imp-field">
                      <label htmlFor="imp-valuta">Valuta principale</label>
                      <select id="imp-valuta" name="valuta" defaultValue="EUR">
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollaro ($)</option>
                        <option value="GBP">Sterlina (£)</option>
                        <option value="CHF">Franco (CHF)</option>
                      </select>
                    </div>
                    <div className="imp-field">
                      <label htmlFor="imp-lingua">Lingua</label>
                      <select id="imp-lingua" name="lingua" defaultValue="it">
                        <option value="it">Italiano</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div className="imp-field">
                    <label htmlFor="imp-data">Formato data</label>
                    <select id="imp-data" name="formato_data" defaultValue="gg-mm-aaaa">
                      <option value="gg-mm-aaaa">GG/MM/AAAA (es. 15/11/2026)</option>
                      <option value="mm-gg-aaaa">MM/GG/AAAA (es. 11/15/2026)</option>
                      <option value="aaaa-mm-gg">AAAA-MM-GG (es. 2026-11-15)</option>
                    </select>
                  </div>

                  <fieldset className="imp-seg-field">
                    <legend>Primo giorno della settimana</legend>
                    <div className="imp-seg">
                      <input type="radio" name="primo_giorno" id="imp-lun" value="lunedi" defaultChecked />
                      <label htmlFor="imp-lun">Lunedì</label>
                      <input type="radio" name="primo_giorno" id="imp-dom" value="domenica" />
                      <label htmlFor="imp-dom">Domenica</label>
                    </div>
                  </fieldset>

                  <div className="imp-actions">
                    <button type="submit" className="imp-btn-primary">Salva preferenze</button>
                  </div>
                </form>
              </section>*/}

            {/* =========================== Notifiche =========================== TODO *
              <section id="notifiche" className="imp-card" aria-labelledby="imp-t-notifiche">
                <div className="imp-card-head">
                  <h2 id="imp-t-notifiche">Notifiche</h2>
                  <p>Decidi quando vuoi essere avvisato.</p>
                </div>

                <form className="imp-form">
                  <div className="imp-switch-list">
                    /* ===== RIGA INTERRUTTORE: copia questo blocco per ogni notifica ===== *
                    <label className="imp-switch" htmlFor="imp-n-budget">
                      <span className="imp-switch-text">
                        <strong>Avvisi sul budget</strong>
                        <span>Ti avvisiamo quando raggiungi l&apos;85% di un budget o lo superi.</span>
                      </span>
                      <input id="imp-n-budget" name="n_budget" type="checkbox" defaultChecked />
                      <span className="imp-switch-track" aria-hidden="true" />
                    </label>
                    /* ===== FINE RIGA INTERRUTTORE ===== *

                    <label className="imp-switch" htmlFor="imp-n-settimana">
                      <span className="imp-switch-text">
                        <strong>Riepilogo settimanale</strong>
                        <span>Ogni lunedì una mail con entrate, uscite e risparmio della settimana.</span>
                      </span>
                      <input id="imp-n-settimana" name="n_settimana" type="checkbox" defaultChecked />
                      <span className="imp-switch-track" aria-hidden="true" />
                    </label>

                    <label className="imp-switch" htmlFor="imp-n-obiettivi">
                      <span className="imp-switch-text">
                        <strong>Promemoria obiettivi</strong>
                        <span>Un promemoria quando un obiettivo di risparmio è indietro rispetto al previsto.</span>
                      </span>
                      <input id="imp-n-obiettivi" name="n_obiettivi" type="checkbox" />
                      <span className="imp-switch-track" aria-hidden="true" />
                    </label>

                    <label className="imp-switch" htmlFor="imp-n-novita">
                      <span className="imp-switch-text">
                        <strong>Novità e aggiornamenti</strong>
                        <span>Le nuove funzioni di Finance, senza spam.</span>
                      </span>
                      <input id="imp-n-novita" name="n_novita" type="checkbox" />
                      <span className="imp-switch-track" aria-hidden="true" />
                    </label>
                  </div>

                  <div className="imp-actions">
                    <button type="submit" className="imp-btn-primary">Salva notifiche</button>
                  </div>
                </form>
              </section>*/}

            {/* =========================== Sicurezza =========================== */}
            <section id="sicurezza" className="imp-card" aria-labelledby="imp-t-sicurezza">
              <div className="imp-card-head">
                <h2 id="imp-t-sicurezza">Sicurezza</h2>
                <p>Proteggi il tuo account con una password forte.</p>
              </div>

              <form className="imp-form">
                <h3 className="imp-subhead">Cambia password</h3>

                <div className="imp-field">
                  <label htmlFor="imp-pw-attuale">Password attuale</label>
                  <input id="imp-pw-attuale" name="password_attuale" type="password" autoComplete="current-password" placeholder="••••••••" />
                </div>

                <div className="imp-field-row">
                  <div className="imp-field">
                    <label htmlFor="imp-pw-nuova">Nuova password</label>
                    <input id="imp-pw-nuova" name="password_nuova" type="password" autoComplete="new-password" minLength={6} placeholder="Almeno 6 caratteri" />
                  </div>
                  <div className="imp-field">
                    <label htmlFor="imp-pw-conferma">Conferma nuova password</label>
                    <input id="imp-pw-conferma" name="password_conferma" type="password" autoComplete="new-password" placeholder="Ripeti la password" />
                  </div>
                </div>

                <div className="imp-actions">
                  <button type="submit" className="imp-btn-primary">Aggiorna password</button>
                </div>
              </form>

              {/*<hr className="imp-sep" />

                <form className="imp-form"> TODO
                  <div className="imp-switch-list">
                    <label className="imp-switch" htmlFor="imp-2fa">TODO
                      <span className="imp-switch-text">
                        <strong>Verifica in due passaggi</strong>
                        <span>Oltre alla password ti chiediamo un codice temporaneo a ogni accesso.</span>
                      </span>
                      <input id="imp-2fa" name="due_passaggi" type="checkbox" />
                      <span className="imp-switch-track" aria-hidden="true" />
                    </label>
                  </div>
                </form>*/}

              <hr className="imp-sep" />

              <div className="imp-device">
                <span className="imp-device-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" className="imp-ic">
                    <path d="M4 5h16v11H4zM2 20h20M9 16v4M15 16v4" />
                  </svg>
                </span>
                <div className="imp-device-text">
                  <strong>Questo dispositivo</strong>
                  <span>Sessione attiva ora</span>
                </div>
                {/* TODO: collegare "Esci da tutti i dispositivi" */}
                <button className="imp-btn-secondary small">Esci da tutti i dispositivi</button>
              </div>
            </section>

            {/* ========================= Dati e privacy ======================== */}
            <section id="dati" className="imp-card" aria-labelledby="imp-t-dati">
              <div className="imp-card-head">
                <h2 id="imp-t-dati">Dati e privacy</h2>
                <p>Tieni sotto controllo le informazioni che hai inserito.</p>
              </div>

              <div className="imp-row">
                <div className="imp-row-text">
                  <strong>Esporta i tuoi dati</strong>
                  <span>Scarica conti, movimenti e budget in un unico file.</span>
                </div>
                {/* TODO: collegare l'esportazione */}
                <a href="#" className="imp-btn-secondary">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="imp-ic">
                    <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
                  </svg>
                  Esporta
                </a>
              </div>

              <div className="imp-row danger">
                <div className="imp-row-text">
                  <strong>Elimina account</strong>
                  <span>Cancella per sempre il tuo account e tutti i dati collegati. Non si può annullare.</span>
                </div>
                <a href="#elimina-account" className="imp-btn-danger-outline">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="imp-ic">
                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                  </svg>
                  Elimina account
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Conferma "Elimina account": si apre con :target, nessun JavaScript */}
      <div id="elimina-account" className="imp-modal" role="alertdialog" aria-modal="true" aria-labelledby="imp-elimina-titolo" aria-describedby="imp-elimina-testo">
        <a href="#" className="imp-modal-backdrop" aria-label="Chiudi finestra" tabIndex={-1} />

        <div className="imp-modal-box">
          <span className="imp-confirm-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" className="imp-ic">
              <path d="M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
            </svg>
          </span>
          <h2 id="imp-elimina-titolo" className="imp-modal-title">Eliminare l&apos;account?</h2>
          <p id="imp-elimina-testo" className="imp-modal-sub">
            Verranno cancellati per sempre conti, movimenti, budget e obiettivi. Questa operazione non può essere annullata.
          </p>

          {/* TODO: collegare l'eliminazione dell'account */}
          <form className="imp-confirm-form">
            <label htmlFor="imp-conferma-testo">Per confermare, scrivi <strong>ELIMINA</strong></label>
            <input id="imp-conferma-testo" name="conferma" type="text" autoComplete="off" placeholder="ELIMINA" required pattern="ELIMINA" />

            <div className="imp-modal-actions">
              <a href="#" className="imp-btn-secondary">Annulla</a>
              <button type="submit" className="imp-btn-danger">Elimina definitivamente</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
