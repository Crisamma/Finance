
export type Movimento = {
  id: string;
  nome: string;
  descrizione: string;
  conto_id: string;
  conto_destinazione_id: string | null;
  categoria: string | null;
  tipo: string;
  importo: number;
  data: Date;
  created_at: string;
};

export function iconaMovimento(movimento: Movimento): string {
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
export function coloreMovimento(movimento: Movimento) {
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