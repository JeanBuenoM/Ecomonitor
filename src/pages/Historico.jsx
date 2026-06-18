import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartaoRegistro from '../components/CartaoRegistro';
import { buscarRegistros, excluirRegistro, exportarCSV } from '../utils/armazenamento';

export default function Historico() {
  const [registros,   setRegistros]   = useState([]);
  const [busca,       setBusca]       = useState('');
  const [filtroTipo,  setFiltroTipo]  = useState('todos');
  const [ordenarPor,  setOrdenarPor]  = useState('data-desc');
  const [dataInicio,  setDataInicio]  = useState('');
  const [dataFim,     setDataFim]     = useState('');
  const [paraExcluir, setParaExcluir] = useState(null);

  const carregarRegistros = () => setRegistros(buscarRegistros());

  useEffect(() => { carregarRegistros(); }, []);

  const filtrados = registros
    .filter((r) => {
      if (filtroTipo !== 'todos' && r.tipo !== filtroTipo) return false;
      if (dataInicio && r.data < dataInicio) return false;
      if (dataFim    && r.data > dataFim)    return false;
      if (busca) {
        const consulta = busca.toLowerCase();
        if (!r.data.includes(consulta) && !r.tipo.includes(consulta) && !r.observacoes.toLowerCase().includes(consulta)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (ordenarPor) {
        case 'data-asc':     return a.data.localeCompare(b.data);
        case 'data-desc':    return b.data.localeCompare(a.data);
        case 'agua-desc':    return b.agua - a.agua;
        case 'energia-desc': return b.energia - a.energia;
        default:             return 0;
      }
    });

  const totalAgua    = filtrados.reduce((s, r) => s + r.agua, 0);
  const totalEnergia = filtrados.reduce((s, r) => s + r.energia, 0);

  const confirmarExclusao = (id) => setParaExcluir(id);

  const executarExclusao = () => {
    if (!paraExcluir) return;
    excluirRegistro(paraExcluir);
    carregarRegistros();
    setParaExcluir(null);
  };

  return (
    <main className="px-4 py-6 md:py-8 max-w-3xl mx-auto">
      <header className="mb-6 fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-water-500 mb-1">Registros</p>
        <h1 className="text-2xl font-extrabold text-slate-800">Histórico de Consumo</h1>
      </header>

      <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4 fade-in-up fade-in-up-delay-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-slate-500 block mb-1">Buscar</label>
            <div className="relative">
              <input
                type="search" value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-water-200 focus:border-water-400"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Tipo</label>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-water-200 bg-white">
              <option value="todos">Todos</option>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">De</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-water-200" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Até</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-water-200" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">Ordenar por</label>
            <select value={ordenarPor} onChange={(e) => setOrdenarPor(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white">
              <option value="data-desc">Data (mais recente)</option>
              <option value="data-asc">Data (mais antiga)</option>
              <option value="agua-desc">Maior consumo de água</option>
              <option value="energia-desc">Maior consumo de energia</option>
            </select>
          </div>
          <button onClick={exportarCSV} disabled={registros.length === 0}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </section>

      {filtrados.length > 0 && (
        <div className="flex gap-3 mb-4 fade-in-up">
          <div className="flex-1 bg-water-50 rounded-xl px-4 py-3 text-center">
            <p className="text-water-700 font-bold text-lg">{totalAgua.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-water-500">litros de água</p>
          </div>
          <div className="flex-1 bg-energy-50 rounded-xl px-4 py-3 text-center">
            <p className="text-energy-700 font-bold text-lg">{totalEnergia.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-energy-500">kWh de energia</p>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-center">
            <p className="text-slate-700 font-bold text-lg">{filtrados.length}</p>
            <p className="text-xs text-slate-400">registros</p>
          </div>
        </div>
      )}

      {filtrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100 fade-in-up">
          <p className="text-slate-400 text-sm mb-3">
            {registros.length === 0 ? 'Nenhum registro cadastrado ainda.' : 'Nenhum resultado para os filtros aplicados.'}
          </p>
          {registros.length === 0 && (
            <Link to="/registrar" className="text-sm font-semibold text-water-600 hover:underline">
              Adicionar primeiro registro
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-in-up">
          {filtrados.map((r) => (
            <CartaoRegistro key={r.id} registro={r} aoExcluir={confirmarExclusao} />
          ))}
        </div>
      )}

      {paraExcluir && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Excluir Registro?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setParaExcluir(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200">
                Cancelar
              </button>
              <button onClick={executarExclusao}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
