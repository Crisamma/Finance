"use client";

import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Login() {
  // variabili di stato per email, password e messaggio
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messaggio, setMessaggio] = useState("");
  const router = useRouter();

  // funzione per il login dell'utente
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessaggio("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessaggio("Email o password non corretti.");
      setLoading(false);
      return;
    }

    router.push("/"); // reindirizza alla dashboard dopo il login
    router.refresh();
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Image src="/images/logo3.png" alt="Logo Finance" width={34} height={34} priority />
          <span>Finance</span>
        </div>

        <h1 className="auth-title">Bentornato</h1>
        <p className="auth-subtitle">Accedi per vedere la panoramica delle tue finanze.</p>

        <form onSubmit={login} className="auth-form" noValidate={false}>
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
            <label htmlFor="password">Password</label>
            <div className="auth-password">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="La tua password"
                autoComplete="current-password"
                required
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

          <div className="auth-message" role="alert" aria-live="polite">
            {messaggio && <p className="auth-error">{messaggio}</p>}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Accesso in corso…" : "Accedi"}
          </button>
        </form>

        <p className="auth-switch">
          Non hai un account? <Link href="/register">Registrati</Link>
        </p>
      </div>
    </main>
  );
}
