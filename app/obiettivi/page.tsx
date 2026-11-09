import Image from "next/image";

/*
  Pagina MANUTENZIONE: un solo file, CSS incluso (nessuna modifica a globals.css).
  Nessun JavaScript: le animazioni sono solo CSS.
  Percorso consigliato: app/manutenzione/page.tsx
*/

const css = `
.manut-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  box-sizing: border-box;
  background:
    radial-gradient(900px 500px at 12% 8%, rgba(11, 122, 107, 0.14), transparent 60%),
    radial-gradient(700px 480px at 92% 92%, rgba(59, 111, 224, 0.12), transparent 60%),
    #f4f6fa;
  color: #0f172a;
  font-family: Arial, Helvetica, sans-serif;
}

.manut-card {
  width: 100%;
  max-width: 520px;
  box-sizing: border-box;
  padding: 44px 36px 36px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e4e9f1;
  border-radius: 24px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 20px 50px rgba(15, 23, 42, 0.1);
}

.manut-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 32px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.manut-illustration {
  position: relative;
  width: 112px;
  height: 112px;
  margin: 0 auto 28px;
  border-radius: 50%;
  background: #ddf3ee;
  color: #0b7a6b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.manut-illustration::before {
  content: "";
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 2px solid rgba(11, 122, 107, 0.2);
  animation: manut-pulse 2.4s ease-out infinite;
}

.manut-gear {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.manut-gear-big {
  transform-origin: 28px 32px;
  animation: manut-spin 9s linear infinite;
}

.manut-gear-small {
  transform-origin: 56px 20px;
  animation: manut-spin 6s linear infinite reverse;
}

.manut-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: #fef0d6;
  color: #9a4a06;
  font-size: 13px;
  font-weight: 600;
}

.manut-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d97706;
  animation: manut-blink 1.4s ease-in-out infinite;
}

.manut-title {
  margin: 18px 0 0;
  font-size: 30px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.manut-text {
  margin: 12px auto 0;
  max-width: 400px;
  font-size: 15px;
  line-height: 1.6;
  color: #566176;
}

.manut-progress {
  position: relative;
  height: 8px;
  margin: 30px auto 0;
  max-width: 360px;
  border-radius: 999px;
  background: #eef2f7;
  overflow: hidden;
}

.manut-progress::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 38%;
  border-radius: 999px;
  background: linear-gradient(90deg, #0b7a6b, #0e9f6e);
  animation: manut-slide 1.8s ease-in-out infinite;
}

.manut-note {
  margin: 14px 0 0;
  font-size: 13px;
  color: #566176;
}

.manut-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
}

.manut-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  padding: 0 20px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: filter 0.15s, background-color 0.15s;
}

.manut-btn.primary {
  background: #0b7a6b;
  color: #ffffff;
}

.manut-btn.primary:hover {
  filter: brightness(1.1);
}

.manut-btn svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.manut-btn:focus-visible {
  outline: 2px solid #3b6fe0;
  outline-offset: 2px;
}

.manut-footer {
  margin: 26px 0 0;
  padding-top: 20px;
  border-top: 1px solid #eef0f3;
  font-size: 13px;
  color: #566176;
}

@keyframes manut-spin {
  to { transform: rotate(360deg); }
}

@keyframes manut-pulse {
  0% { transform: scale(0.92); opacity: 0.9; }
  100% { transform: scale(1.22); opacity: 0; }
}

@keyframes manut-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

@keyframes manut-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(263%); }
}

@media (max-width: 480px) {
  .manut-card { padding: 36px 22px 28px; }
  .manut-title { font-size: 25px; }
}

@media (prefers-reduced-motion: reduce) {
  .manut-illustration::before,
  .manut-gear-big,
  .manut-gear-small,
  .manut-dot,
  .manut-progress::after {
    animation: none;
  }
  .manut-progress::after { width: 38%; transform: translateX(80%); }
}
`;

export default function Manutenzione() {
  return (
    <main className="manut-page">
      <style>{css}</style>

      <div className="manut-card">
        <div className="manut-brand">
          <Image src="/images/logo3.png" alt="Logo Finance" width={30} height={30} style={{ width: "34px", height: "auto" }} priority />
          <span>Finance</span>
        </div>

        <div className="manut-illustration" aria-hidden="true">
          <svg viewBox="0 0 80 64" width="88" height="70">
            {/* ingranaggio grande */}
            <g className="manut-gear manut-gear-big">
              <circle cx="28" cy="32" r="8" />
              <path d="M28 12v6M28 46v6M8 32h6M42 32h6M13.9 17.9l4.2 4.2M37.9 41.9l4.2 4.2M13.9 46.1l4.2-4.2M37.9 22.1l4.2-4.2" />
              <circle cx="28" cy="32" r="16" />
            </g>
            {/* ingranaggio piccolo */}
            <g className="manut-gear manut-gear-small">
              <circle cx="56" cy="20" r="4.5" />
              <path d="M56 8v3M56 29v3M44 20h3M65 20h3M47.5 11.5l2.1 2.1M62.4 26.4l2.1 2.1M47.5 28.5l2.1-2.1M62.4 13.6l2.1-2.1" />
              <circle cx="56" cy="20" r="9" />
            </g>
          </svg>
        </div>

        <span className="manut-badge" role="status">
          <span className="manut-dot" aria-hidden="true" />
          Manutenzione in corso
        </span>

        <h1 className="manut-title">Torniamo presto</h1>
        <p className="manut-text">
          Stiamo aggiornando Finance per offrirti un&apos;esperienza migliore. I tuoi dati sono al sicuro e
          tutto sarà di nuovo disponibile a breve.
        </p>

        <div className="manut-progress" role="progressbar" aria-label="Aggiornamento in corso" />
        <p className="manut-note">Aggiornamento in corso…</p>

        <div className="manut-actions">
          {/* Link a se stessa: ricarica la pagina senza usare JavaScript */}
          <a href="/" className="manut-btn primary">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7" />
            </svg>
            Torna alla Home
          </a>
        </div>

        <p className="manut-footer">Grazie per la pazienza. Il team di Finance</p>
      </div>
    </main>
  );
}
