"use client";

export default function DashboardCard() {

  return (


    <><div className="dashboard-card1">
      <div className="card-saldoTotale">
        <h2 style={{ fontSize: '18px', color: '#171717' }}>Saldo totale</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>€ 1.234,56</p>
        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#42454b' }}>+2,4% rispetto al mese precedente</p>
      </div>

      <div className="card-entrate">
        <h2 style={{ fontSize: '18px', color: '#171717' }}>Saldo totale</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>€ 1.234,56</p>
        <p style={{ fontSize: '12px', fontWeight: 'bold' }}>+2,4%</p>
      </div>

      <div className="card-uscite">
        <h2 style={{ fontSize: '18px', color: '#171717' }}>Saldo totale</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>€ 1.234,56</p>
        <p style={{ fontSize: '12px', fontWeight: 'bold' }}>+2,4%</p>
      </div>

      <div className="card-risparmio">
        <h2 style={{ fontSize: '18px', color: '#171717' }}>Risparmio</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>€ 1.234,56</p>
        <p style={{ fontSize: '12px', fontWeight: 'bold' }}>+2,4% </p>
      </div>


    </div><div className="dashboard-card2"> 
      <div className="card-entrateUscite">
        <div className="card-scrittaEntrateUscite">
          <h2 style={{ fontSize: '18px', color: '#171717', fontWeight: 'bold' }}>Entrate e Uscite</h2>
          <p style={{ fontSize: '16px', alignSelf: 'flex-end' }}>Entrate</p>
          <p style={{ fontSize: '16px', alignSelf: 'flex-end' }}>Uscite</p>
        </div>

        <div className="card-graficoEntrateUscite">
          <div className="grafico-entrate">
            <div className="barra-entrate" style={{ height: '80%' }}></div>
          </div>
          <div className="grafico-uscite">
            <div className="barra-uscite" style={{ height: '60%' }}></div>
          </div>
        </div>
        
      </div>

      <div className="card-spese">
        <h2 style={{ fontSize: '18px', color: '#171717', fontWeight: 'bold' }}>Spese per categoria</h2>
        <p></p>
      </div>
    </div></>
  );
}