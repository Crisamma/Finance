"use client";

import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Messaggio = { tipo: "errore" | "ok"; testo: string } | null;

export default function Register() {
  // variabili di stato per email, password e messaggio
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [conferma, setConferma] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messaggio, setMessaggio] = useState<Messaggio>(null);
  const router = useRouter();

  // funzione per registrare l'utente
  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessaggio(null);

    if (password.length < 6) {
      setMessaggio({ tipo: "errore", testo: "La password deve avere almeno 6 caratteri." });
      return;
    }
    if (password !== conferma) {
      setMessaggio({ tipo: "errore", testo: "Le due password non coincidono." });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });

    if (error) {
      setMessaggio({ tipo: "errore", testo: "Registrazione fallita. Controlla i dati e riprova." });
      setLoading(false);
      return;
    }

    // Se la conferma email è disattivata su Supabase, l'utente è già loggato
    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setMessaggio({
      tipo: "ok",
      testo: "Registrazione riuscita! Controlla la tua email per confermare l'account.",
    });
    setLoading(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Image src="/images/logo3.png" alt="Logo Finance" width={34} height={34} priority />
          <span>Finance</span>
        </div>

        <h1 className="auth-title">Crea il tuo account</h1>
        <p className="auth-subtitle">Inizia a tenere sotto controllo entrate, uscite e obiettivi.</p>

        <form onSubmit={register} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="nome@esempio.it"
              autoComplete="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="username">Nome utente</label>
            <input
              id="username"
              type="text"
              value={username}
              placeholder="Il tuo nome utente"
              autoComplete="username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-password">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Almeno 6 caratteri"
                autoComplete="new-password"
                required
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="auth-eye"
                aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((s) => !s)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    d={
                      showPassword
                        ? "M3 3l18 18M10.6 6.1A9.7 9.7 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.9M6.6 6.6C3.8 8.3 2 12 2 12s4 7 10 7c1.5 0 2.9-.4 4.1-1M9.9 9.9a3 3 0 004.2 4.2"
                        : "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="conferma">Conferma password</label>
            <input
              id="conferma"
              type={showPassword ? "text" : "password"}
              value={conferma}
              placeholder="Ripeti la password"
              autoComplete="new-password"
              required
              onChange={(e) => setConferma(e.target.value)}
            />
          </div>

          <div className="auth-message" role="alert" aria-live="polite">
            {messaggio && (
              <p className={messaggio.tipo === "ok" ? "auth-success" : "auth-error"}>{messaggio.testo}</p>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creazione account…" : "Registrati"}
          </button>
        </form>

        <p className="auth-switch">
          Hai già un account? <Link href="/login">Accedi</Link>
        </p>
      </div>
    </main>
  );
}
