
type GraficoVariazioneProps = {
  andamento: "su" | "giu" | "nessuna";
  className?: string;
  width?: string | number;
  height?: number;
  coloreStatico?: boolean;
};

export default function GraficoVariazione({
  andamento,
  className,
  width = "100%",
  height = 40,
  coloreStatico = false
}: GraficoVariazioneProps) {

  const colore = coloreStatico
    ? "#fff"
    : andamento === "su"
      ? "var(--pos-line)"
      : andamento === "giu"
        ? "#ef4444"
        : "#94a3b8";

  if (andamento === "nessuna") {
    return (
      <svg
        viewBox="0 0 160 40"
        width={width}
        height={height}
        preserveAspectRatio="none"
        aria-hidden="true"
        className={className}
      >
        <polygon
          points="0,20 22.9,20 45.7,20 68.6,20 91.4,20 114.3,20 137.1,20 160,20 160,40 0,40"
          style={{
            fill: colore,
            fillOpacity: 0.16
          }}
        />
        <polyline
          points="0,20 22.9,20 45.7,20 68.6,20 91.4,20 114.3,20 137.1,20 160,20"
          style={{
            fill: "none",
            stroke: colore,
            strokeWidth: coloreStatico ? 2.5 : 2,
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  const punti = andamento === "su"
    ? "0,36 22.9,25.3 45.7,25.3 68.6,14.7 91.4,20 114.3,9.3 137.1,14.7 160,4"
    : "0,10.6 22.9,17.3 45.7,4 68.6,14 91.4,23.9 114.3,20.6 137.1,30.6 160,36";

  return (
    <svg
      viewBox="0 0 160 40"
      width={width}
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <polygon
        points={`${punti} 160,40 0,40`}
        style={{
          fill: colore,
          fillOpacity: 0.16
        }}
      />
      <polygon
        points={`${punti} 160,40 0,40`}
        style={{
          fill: coloreStatico ? "#fff" : colore,
          fillOpacity: 0.16
        }}
      />
      <polyline
        points={punti}
        style={{
          fill: "none",
          stroke: colore,
          strokeWidth: coloreStatico ? 2.5 : 2,
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
