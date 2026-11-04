"use client";

import Image from "next/image";
import { useState } from "react";
import Sidebar from "../sidebar";

type Conto = {
  nome: string;
  tipo: string;
  saldo: number;
  image: File | string;
};

export default function Conti() {
  const [isOpen, setIsOpen] = useState(false);
  const [conti, setConti] = useState<Conto[]>([]);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Conto corrente");
  const [saldo, setSaldo] = useState("");
  const [image, setImage] = useState<File | string>("/images/bank.png");
  const creaConto = () => {
    const nuovoConto = {
      nome: nome,
      tipo: tipo,
      saldo: Number(saldo),
      image: image,
    };
    setConti([...conti, nuovoConto]);
    setIsOpen(false);
  };

  return (
    <main className="min-h-screen bg-white">

      <Sidebar />

      <div className="main-contentConti">

        <div className="conti-header">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#171717', paddingLeft: '20px' }}>
            Conti
          </h1>
          <button id="nuovo-conto" onClick={() => setIsOpen(true)}>
            + Nuovo Conto
          </button>

        </div>

        {isOpen && (
          <div className="modal">
            <div className="modal-content">
              <Image className="modal-close"
                src="/images/close.png"
                alt="close"
                width={20}
                height={20}
                loading="eager"
                onClick={() => setIsOpen(false)}
              />
              <div className="modal-header">
                <h2>Nuovo conto</h2>
                <p>Aggiungi un conto per tenere sotto controllo le tue finanze.</p>
              </div>

              <div className="form-field">
                <label>Nome Conto</label>
                <input
                  type="text"
                  placeholder="Es. Intesa San Paolo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Tipo Conto</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option>Conto Corrente</option>
                  <option>Carta</option>
                  <option>Contanti</option>
                  <option>Investimenti</option>
                  <option>Conto Deposito</option>
                  <option>Criptovalute</option>
                  <option>Altro</option>
                </select>
              </div>

              <div className="form-field">
                <label>Saldo Iniziale</label>
                <input
                  type="number"
                  placeholder="0,00"
                  value={saldo}
                  onChange={(e) => setSaldo(e.target.value)}
                />
              </div>

              <div className="form-section">
                <h3>PERSONALIZZAZIONE</h3>

                <div className="form-field">
                  <label>Immagine</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] ?? "/images/bank.png")}
                  />
                </div>
              </div>


              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setIsOpen(false)}
                >
                  Annulla
                </button>

                <button
                  className="save-button"
                  onClick={() => creaConto()}
                >
                  Crea conto
                </button>
              </div>
            </div>
          </div>
        )}

        <p style={{ fontSize: '16px', color: '#42454b', paddingLeft: '20px', paddingTop: '10px' }}>
          Tutti i tuoi conti in un unico posto. Visualizza saldi, movimenti e gestisci le tue finanze.
        </p>

        <div className="dashboard-conti">
          {conti.map((conto) => (
            <div className="card-conto">
              <Image className="logo-banca"
                src="/images/bank.png"
                alt="Logo Banca"
                width={30}
                height={30}
                loading="eager"
              />

              <div className="dati-conto">
                <h1>{conto.nome}</h1>
                <h2>€ {conto.saldo}</h2>
                <p>{conto.tipo}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </main>
  );
}