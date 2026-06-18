import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartaoEstatistica from '../components/CartaoEstatistica';
import CartaoRegistro    from '../components/CartaoRegistro';
import CartaoClima       from '../components/CartaoClima';
import {
  buscarRegistros,
  buscarTotaisMesAtual,
  buscarTotaisMesAnterior,
  buscarMeta,
} from '../utils/armazenamento';

function calcularTendencia(atual, anterior) {
  if (!anterior || anterior === 0) return null;
  return ((atual - anterior) / anterior) * 100;
}

export default function Painel() {
  const [totaisAtuais,    setTotaisAtuais]    = useState({ agua: 0, energia: 0, registros: 0 });
  const [totaisAnteriores, setTotaisAnteriores] = useState({ agua: 0, energia: 0 });
  const [registrosRecentes, setRegistrosRecentes] = useState([]);
  const [meta,             setMeta]             = useState({ metaAgua: 5000, metaEnergia: 300 });

  const agora = new Date();
  const mes   = agora.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  useEffect(() => {
    setTotaisAtuais(buscarTotaisMesAtual());
    setTotaisAnteriores(buscarTotaisMesAnterior());
    setMeta(buscarMeta());
    const todos = buscarRegistros().sort((a, b) => new Date(b.data) - new Date(a.data));
    setRegistrosRecentes(todos.slice(0, 5));
  }, []);

  const tendenciaAgua    = calcularTendencia(totaisAtuais.agua,    totaisAnteriores.agua);
  const tendenciaEnergia = calcularTendencia(totaisAtuais.energia, totaisAnteriores.energia);

  return (
    <main className="px-4 py-6 md:py-8 max-w-3xl mx-auto">
      <header className="mb-6 fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-water-500 mb-1">
          {mes.charAt(0).toUpperCase() + mes.slice(1)}
        </p>
        <h1 className="text-2xl font-extrabold text-slate-800">Resumo do Consumo</h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <CartaoEstatistica
          rotulo="Água"
          valor={totaisAtuais.agua}
          unidade="L"
          meta={meta.metaAgua}
          cor="water"
          tendencia={tendenciaAgua}
          atraso={1}
          icone={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 011.032 0 11.209 11.209 0 007.877 3.08.75.75 0 01.722.515 12.74 12.74 0 01.635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 01-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.189-2.737.535-4.018a.75.75 0 01.72-.511 11.21 11.21 0 007.98-3.051z" clipRule="evenodd" />
            </svg>
          }
        />
        <CartaoEstatistica
          rotulo="Energia"
          valor={totaisAtuais.energia}
          unidade="kWh"
          meta={meta.metaEnergia}
          cor="energy"
          tendencia={tendenciaEnergia}
          atraso={2}
          icone={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
            </svg>
          }
        />
      </section>

      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 fade-in-up fade-in-up-delay-3 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-700">Registros Recentes</h2>
          <Link to="/historico" className="text-xs text-water-600 font-semibold hover:text-water-800 transition-colors">
            Ver todos →
          </Link>
        </div>

        {registrosRecentes.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-slate-400 text-sm">Nenhum registro ainda.</p>
            <Link to="/registrar" className="mt-3 inline-block text-sm font-semibold text-water-600 hover:underline">
              Adicionar primeiro registro
            </Link>
          </div>
        ) : (
          <div>
            {registrosRecentes.map((r) => (
              <CartaoRegistro key={r.id} registro={r} compacto />
            ))}
          </div>
        )}
      </section>

      <div className="mt-4">
        <CartaoClima cidade="Castro, PR" lat={-24.79} lon={-50.01} />
      </div>
    </main>
  );
}
