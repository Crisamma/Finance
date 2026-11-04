"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Dati di esempio: sostituiscili con i dati reali (API / database)  */
/* ------------------------------------------------------------------ */

type PeriodKey = "settimana" | "mese" | "anno";

type Delta = { v: number; d: string; up: boolean; good: boolean };

type PeriodData = {
  sub: string;
  hero: Delta;
  ent: Delta;
  usc: Delta;
  ris: Delta;
  sp: { hero: number[]; ent: number[]; usc: number[]; ris: number[] };
  labels: string[];
  inc: number[];
  exp: number[];
  max: number;
  cats: number[];
  insight: string;
};

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "settimana", label: "Settimana" },
  { key: "mese", label: "Mese" },
  { key: "anno", label: "Anno" },
];

const DATA: Record<PeriodKey, PeriodData> = {
  settimana: {
    sub: "rispetto alla settimana precedente",
    hero: { v: 8742.3, d: "+0,6%", up: true, good: true },
    ent: { v: 875, d: "+3,2%", up: true, good: true },
    usc: { v: 465.2, d: "-8,4%", up: false, good: true },
    ris: { v: 409.8, d: "+14,0%", up: true, good: true },
    sp: {
      hero: [8600, 8610, 8640, 8620, 8700, 8690, 8720, 8742],
      ent: [0, 95, 95, 875, 875, 875, 875, 875],
      usc: [64, 102, 214, 259, 409, 447, 465, 465],
      ris: [120, 180, 150, 300, 280, 340, 380, 409],
    },
    labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    inc: [0, 95, 0, 780, 0, 0, 0],
    exp: [64, 38.2, 112, 45, 150, 38, 18],
    max: 800,
    cats: [10, 38, 20, 22, 10],
    insight:
      "Questa settimana hai speso l’8% in meno rispetto alla precedente. Il budget Svago è quasi al limite.",
  },
  mese: {
    sub: "rispetto al mese precedente",
    hero: { v: 8742.3, d: "+2,4%", up: true, good: true },
    ent: { v: 3200, d: "+5,1%", up: true, good: true },
    usc: { v: 2118.4, d: "-12,0%", up: false, good: true },
    ris: { v: 1081.6, d: "+18,3%", up: true, good: true },
    sp: {
      hero: [7900, 8050, 8000, 8300, 8400, 8350, 8600, 8742],
      ent: [2900, 3000, 3000, 3100, 3050, 3150, 3100, 3200],
      usc: [2500, 2400, 2600, 2450, 2300, 2350, 2200, 2118],
      ris: [700, 820, 760, 900, 880, 950, 1010, 1081],
    },
    labels: ["Mag", "Giu", "Lug", "Ago", "Set", "Ott"],
    inc: [3000, 3050, 3100, 3200, 3150, 3200],
    exp: [2400, 2350, 2600, 2250, 2400, 2118.4],
    max: 4000,
    cats: [34, 22, 14, 18, 12],
    insight:
      "Hai speso il 12% in meno rispetto al mese scorso: ottimo lavoro. Il budget Svago è però al 92%.",
  },
  anno: {
    sub: "rispetto all’anno precedente",
    hero: { v: 8742.3, d: "+9,8%", up: true, good: true },
    ent: { v: 38400, d: "+6,7%", up: true, good: true },
    usc: { v: 27150, d: "+2,1%", up: true, good: false },
    ris: { v: 11250, d: "+21,5%", up: true, good: true },
    sp: {
      hero: [6900, 7200, 7000, 7600, 7900, 8200, 8500, 8742],
      ent: [3100, 3150, 3200, 3200, 3250, 3200, 3300, 3300],
      usc: [2200, 2300, 2150, 2250, 2300, 2200, 2400, 2200],
      ris: [900, 850, 1050, 950, 950, 1000, 900, 1100],
    },
    labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
    inc: [3100, 3150, 3200, 3200, 3250, 3200, 3300, 3100, 3150, 3200, 3250, 3300],
    exp: [2200, 2300, 2150, 2250, 2300, 2200, 2400, 2350, 2250, 2300, 2250, 2200],
    max: 4000,
    cats: [38, 20, 12, 17, 13],
    insight: "Le spese annuali crescono del 2,1%, ma il tuo risparmio è salito del 21,5%.",
  },
};

const CAT_NAMES = ["Casa", "Alimentari", "Trasporti", "Svago", "Altro"];
const CAT_COLORS = ["#3B6FE0", "#0E9F6E", "#C97A06", "#8B5CF6", "#64748B"];

const TRANSACTIONS = [
  { name: "Stipendio", meta: "Entrata · Oggi", amount: 3200, tone: "pos", icon: "M3 17l6-6 4 4 8-8M15 7h6v6" },
  { name: "Esselunga", meta: "Alimentari · Ieri", amount: -64.2, tone: "warn", icon: "M3 4h2l2.4 11h10.2l2-8H6.2M9 20a1 1 0 100-2 1 1 0 000 2M17 20a1 1 0 100-2 1 1 0 000 2" },
  { name: "Affitto ottobre", meta: "Casa · 28 ott", amount: -720, tone: "info", icon: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  { name: "Netflix", meta: "Svago · 27 ott", amount: -12.99, tone: "vio", icon: "M8 5v14l11-7z" },
  { name: "Trenitalia", meta: "Trasporti · 25 ott", amount: -38.5, tone: "", icon: "M7 3h10a2 2 0 012 2v10a3 3 0 01-3 3H8a3 3 0 01-3-3V5a2 2 0 012-2zM5 11h14M8 21l2-3M16 21l-2-3" },
];

const BUDGETS = [
  { name: "Alimentari", spent: 312, limit: 400 },
  { name: "Svago", spent: 138, limit: 150 },
  { name: "Trasporti", spent: 54, limit: 120 },
  { name: "Abbonamenti", spent: 46, limit: 40 },
];

const GOALS = [
  { name: "Vacanza", cur: 1300, tot: 2000, color: "#3B6FE0" },
  { name: "Fondo emergenza", cur: 2400, tot: 6000, color: "#0E9F6E" },
  { name: "Auto nuova", cur: 3300, tot: 15000, color: "#8B5CF6" },
];

/* ------------------------------------------------------------------ */
/*  Utilità                                                            */
/* ------------------------------------------------------------------ */

const ARROW_UP = "M7 17L17 7M9 7h8v8";
const ARROW_DOWN = "M7 7l10 10M17 9v8H9";

// Formattazione manuale (uguale su server e client: niente errori di idratazione)
function fmt(n: number): string {
  const [int, dec] = Math.abs(n).toFixed(2).split(".");
  return (n < 0 ? "-" : "") + int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + dec;
}

function euro(n: number, hidden: boolean): string {
  return hidden ? "€ ••••" : "€ " + fmt(n);
}

function sparkPoints(arr: number[], w = 160, h = 40) {
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const pts = arr.map((v, i) => {
    const x = (i * (w / (arr.length - 1))).toFixed(1);
    const y = (h - 4 - ((v - mn) / (mx - mn || 1)) * (h - 8)).toFixed(1);
    return `${x},${y}`;
  });
  return { line: pts.join(" "), area: `${pts.join(" ")} ${w},${h} 0,${h}` };
}

// Animazione "count-up": progress va da 0 a 1 ogni volta che cambia `trigger`
function useProgress(trigger: unknown): number {
  const [p, setP] = useState(1);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const start = performance.now();
    setP(0);
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setP(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger]);
  return p;
}

function Icon({ d, size = 18, strokeWidth }: { d: string; size?: number; strokeWidth?: number }) {
  return (
    <svg
      className="dash-ic"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      style={strokeWidth ? { strokeWidth } : undefined}
    >
      <path d={d} />
    </svg>
  );
}

function Spark({ data, color, opacity = 0.12 }: { data: number[]; color: string; opacity?: number }) {
  const { line, area } = sparkPoints(data);
  return (
    <svg viewBox="0 0 160 40" width="100%" height="40" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={area} style={{ fill: color, fillOpacity: opacity }} />
      <polyline
        points={line}
        style={{ fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Componente                                                         */
/* ------------------------------------------------------------------ */

export default function DashboardCard() {
  const [period, setPeriod] = useState<PeriodKey>("mese");
  const [hidden, setHidden] = useState(false);
  const [cat, setCat] = useState(-1);
  const [greeting, setGreeting] = useState("Benvenuto");

  const p = useProgress(period);
  const D = DATA[period];

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Buongiorno" : h < 18 ? "Buon pomeriggio" : "Buonasera");
  }, []);

  const heroSpark = sparkPoints(D.sp.hero);

  const kpis = [
    { key: "ent", label: "Entrate", icon: "M3 17l6-6 4 4 8-8M15 7h6v6", tone: "pos", d: D.ent },
    { key: "usc", label: "Uscite", icon: "M3 7l6 6 4-4 8 8M15 17h6v-6", tone: "warn", d: D.usc },
    { key: "ris", label: "Risparmio", icon: "M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6", tone: "info", d: D.ris },
  ] as const;

  // Ciambella
  const CIRC = 2 * Math.PI * 46;
  let acc = 0;
  const arcs = D.cats.map((pct, i) => {
    const len = (pct / 100) * CIRC * p;
    const arc = { len, off: acc };
    acc += len;
    return arc;
  });

  const donutLabel = cat >= 0 ? CAT_NAMES[cat] : "Uscite";
  const donutValue = cat >= 0 ? D.usc.v * (D.cats[cat] / 100) * p : D.usc.v * p;

  const GC = 2 * Math.PI * 34;

  return (
    <div className="dash">
      {/* Intestazione */}
      <header className="dash-header">
        <div>
          <h1 className="dash-title">{greeting}, username</h1>
          <p className="dash-subtitle">Ecco la panoramica delle tue finanze oggi.</p>
        </div>

        <div className="dash-actions">
          <div className="dash-seg" role="group" aria-label="Periodo">
            {PERIODS.map((pr) => (
              <button
                key={pr.key}
                type="button"
                className={period === pr.key ? "on" : ""}
                aria-pressed={period === pr.key}
                onClick={() => {
                  setPeriod(pr.key);
                  setCat(-1);
                }}
              >
                {pr.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="dash-icon-btn"
            aria-label="Nascondi importi"
            aria-pressed={hidden}
            onClick={() => setHidden((h) => !h)}
          >
            <Icon
              size={20}
              d={
                hidden
                  ? "M3 3l18 18M10.6 6.1A9.7 9.7 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.9M6.6 6.6C3.8 8.3 2 12 2 12s4 7 10 7c1.5 0 2.9-.4 4.1-1M9.9 9.9a3 3 0 004.2 4.2"
                  : "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z"
              }
            />
          </button>

          {/* TODO: collegare al modal / pagina "nuova transazione" */}
          <button type="button" className="dash-btn primary">
            <Icon d="M12 5v14M5 12h14" strokeWidth={2.4} />
            Nuova transazione
          </button>
        </div>
      </header>

      {/* Messaggio utile */}
      <div className="dash-insight">
        <Icon
          size={22}
          d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"
        />
        <p>{D.insight}</p>
      </div>

      {/* Card riepilogo */}
      <section className="dash-kpis" aria-label="Riepilogo">
        <div className="dash-card dash-hero lift">
          <div>
            <div className="dash-hero-label">
              <Icon size={20} d="M3 7a2 2 0 012-2h13v4M3 7v11a2 2 0 002 2h15V9H5a2 2 0 01-2-2zM16 14.5h.01" />
              Saldo totale
            </div>
            <div className="dash-hero-value">{euro(D.hero.v * p, hidden)}</div>
            <div className="dash-hero-badge">
              <Icon size={14} strokeWidth={2.4} d={D.hero.up ? ARROW_UP : ARROW_DOWN} />
              {D.hero.d} {D.sub}
            </div>
          </div>
          <svg viewBox="0 0 160 40" width="200" height="50" aria-hidden="true" className="dash-hero-spark">
            <polygon points={heroSpark.area} style={{ fill: "#fff", fillOpacity: 0.16 }} />
            <polyline
              points={heroSpark.line}
              style={{ fill: "none", stroke: "#fff", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" }}
            />
          </svg>
        </div>

        {kpis.map((k) => (
          <div key={k.key} className="dash-card dash-kpi lift">
            <div className="dash-kpi-top">
              <span>{k.label}</span>
              <span className={"dash-chip " + k.tone}>
                <Icon d={k.icon} />
              </span>
            </div>
            <div className="dash-kpi-value">{euro(k.d.v * p, hidden)}</div>
            <div className="dash-kpi-delta">
              <span className={"dash-badge " + (k.d.good ? "pos" : "neg")}>
                <Icon size={12} strokeWidth={2.6} d={k.d.up ? ARROW_UP : ARROW_DOWN} />
                {k.d.d}
              </span>
              <span className="dash-muted">vs periodo prec.</span>
            </div>
            <Spark data={D.sp[k.key]} color={k.d.good ? "var(--pos-line)" : "var(--neg-line)"} />
          </div>
        ))}
      </section>

      {/* Grafici */}
      <section className="dash-row">
        <div className="dash-card dash-panel dash-wide">
          <div className="dash-panel-head">
            <div>
              <h2>Entrate e Uscite</h2>
              <p className="dash-muted">
                Netto del periodo:{" "}
                <strong className="dash-pos">
                  {hidden ? "€ ••••" : "+ € " + fmt((D.ent.v - D.usc.v) * p)}
                </strong>
              </p>
            </div>
            <div className="dash-legend-inline">
              <span><i style={{ background: "var(--bar-in)" }} />Entrate</span>
              <span><i style={{ background: "var(--bar-out)" }} />Uscite</span>
            </div>
          </div>

          <div className="dash-chart">
            <div className="dash-gridlines" aria-hidden="true">
              {[D.max, D.max / 2, 0].map((v, i) => (
                <div key={i} className="dash-gridline" style={{ top: `${i * 50}%` }}>
                  <span>{hidden ? "••" : v >= 1000 ? (v / 1000).toString().replace(".", ",") + "k" : v}</span>
                </div>
              ))}
            </div>
            <div className="dash-cols">
              {D.labels.map((l, i) => (
                <div key={l} className="dash-col" tabIndex={0}>
                  <div className="dash-tip">
                    <strong>{l}</strong>
                    <br />
                    Entrate {euro(D.inc[i], hidden)}
                    <br />
                    Uscite {euro(D.exp[i], hidden)}
                  </div>
                  <div className="dash-bars">
                    <div className="dash-bar in" style={{ height: `${(D.inc[i] / D.max) * 100 * p}%` }} />
                    <div className="dash-bar out" style={{ height: `${(D.exp[i] / D.max) * 100 * p}%` }} />
                  </div>
                  <span className="dash-col-label">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-card dash-panel dash-narrow">
          <h2>Spese per categoria</h2>
          <p className="dash-muted">Tocca una categoria per metterla a fuoco</p>

          <div className="dash-donut-wrap">
            <div className="dash-donut">
              <svg viewBox="0 0 120 120" width="176" height="176" role="img" aria-label="Grafico a ciambella delle spese per categoria">
                <g transform="rotate(-90 60 60)">
                  <circle cx="60" cy="60" r="46" style={{ fill: "none", stroke: "var(--chip)", strokeWidth: 12 }} />
                  {arcs.map((a, i) => (
                    <circle
                      key={i}
                      cx="60"
                      cy="60"
                      r="46"
                      style={{
                        fill: "none",
                        stroke: CAT_COLORS[i],
                        strokeWidth: cat === i ? 16 : 12,
                        strokeDasharray: `${Math.max(a.len - 2, 0.1).toFixed(2)} ${CIRC.toFixed(2)}`,
                        strokeDashoffset: (-a.off).toFixed(2),
                        opacity: cat >= 0 && cat !== i ? 0.35 : 1,
                        transition: "stroke-width .2s, opacity .2s",
                      }}
                    />
                  ))}
                </g>
              </svg>
              <div className="dash-donut-center">
                <span className="dash-muted">{donutLabel}</span>
                <strong>{euro(donutValue, hidden)}</strong>
              </div>
            </div>

            <div className="dash-legend">
              {D.cats.map((pct, i) => (
                <button
                  key={CAT_NAMES[i]}
                  type="button"
                  className={"dash-leg" + (cat === i ? " on" : "")}
                  aria-pressed={cat === i}
                  onClick={() => setCat(cat === i ? -1 : i)}
                >
                  <i style={{ background: CAT_COLORS[i] }} />
                  <span>{CAT_NAMES[i]}</span>
                  <span className="dash-muted">{pct}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Movimenti, budget, obiettivi */}
      <section className="dash-row top">
        <div className="dash-card dash-panel dash-wide">
          <div className="dash-panel-head">
            <h2>Ultimi movimenti</h2>
            <a href="/movimenti" className="dash-link">Vedi tutti</a>
          </div>
          <div className="dash-tx-list">
            {TRANSACTIONS.map((t) => (
              <div key={t.name} className="dash-tx">
                <span className={"dash-chip " + t.tone}>
                  <Icon d={t.icon} />
                </span>
                <div className="dash-tx-text">
                  <strong>{t.name}</strong>
                  <span className="dash-muted">{t.meta}</span>
                </div>
                <span className={"dash-amt" + (t.amount > 0 ? " pos" : "")}>
                  {(t.amount > 0 ? "+ " : "− ") + euro(Math.abs(t.amount), hidden)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-narrow dash-stack">
          <div className="dash-card dash-panel">
            <div className="dash-panel-head">
              <h2>Budget</h2>
              <a href="/budget" className="dash-link">Gestisci</a>
            </div>
            <div className="dash-budgets">
              {BUDGETS.map((b) => {
                const ratio = b.spent / b.limit;
                const tone = ratio > 1 ? "over" : ratio >= 0.85 ? "warn" : "ok";
                const status =
                  tone === "over"
                    ? "Superato di " + euro(b.spent - b.limit, hidden)
                    : tone === "warn"
                    ? "Quasi al limite"
                    : "In linea";
                return (
                  <div key={b.name}>
                    <div className="dash-budget-head">
                      <span>{b.name}</span>
                      <span className="dash-muted">
                        {euro(b.spent, hidden)} / {euro(b.limit, hidden)}
                      </span>
                    </div>
                    <div className="dash-track" role="img" aria-label={`${b.name}: ${Math.round(ratio * 100)}% del budget utilizzato`}>
                      <div className={"dash-fill " + tone} style={{ width: `${Math.min(100, ratio * 100 * p)}%` }} />
                    </div>
                    <div className={"dash-status " + tone}>
                      {Math.round(ratio * 100)}% · {status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dash-card dash-panel">
            <h2>Obiettivi di risparmio</h2>
            <div className="dash-goals">
              {GOALS.map((g) => {
                const ratio = g.cur / g.tot;
                return (
                  <div key={g.name} className="dash-goal">
                    <div className="dash-goal-ring">
                      <svg viewBox="0 0 84 84" width="84" height="84" role="img" aria-label={`${g.name}: ${Math.round(ratio * 100)}% raggiunto`}>
                        <g transform="rotate(-90 42 42)">
                          <circle cx="42" cy="42" r="34" style={{ fill: "none", stroke: "var(--chip)", strokeWidth: 8 }} />
                          <circle
                            cx="42"
                            cy="42"
                            r="34"
                            style={{
                              fill: "none",
                              stroke: g.color,
                              strokeWidth: 8,
                              strokeLinecap: "round",
                              strokeDasharray: `${(ratio * GC * p).toFixed(2)} ${GC.toFixed(2)}`,
                            }}
                          />
                        </g>
                      </svg>
                      <span>{Math.round(ratio * 100)}%</span>
                    </div>
                    <strong>{g.name}</strong>
                    <span className="dash-muted">
                      {euro(g.cur, hidden)} di {euro(g.tot, hidden)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
