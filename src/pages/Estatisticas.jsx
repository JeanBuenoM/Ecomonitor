import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { buscarRegistros, buscarTotaisMensais, buscarMeta, salvarMeta } from '../utils/armazenamento';

const NOMES_MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function rotuloMes(chave) {
  const [ano, mes] = chave.split('-');
  return `${NOMES_MESES[parseInt(mes, 10) - 1]}/${ano.slice(2)}`;
}

const CORES_PIZZA_AGUA    = ['#0ea5e9', '#38bdf8', '#7dd3fc'];
const CORES_PIZZA_ENERGIA = ['#f59e0b', '#fbbf24', '#fde68a'];

function TooltipPersonalizado({ active, payload, label, suffix }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value.toLocaleString('pt-BR')} {suffix}
        </p>
      ))}
    </div>
  );
}

export default function Estatisticas() {
  const [dadosMensais, setDadosMensais] = useState([]);
  const [dadosDiarios, setDadosDiarios] = useState([]);
  const [meta,         setMeta_]        = useState({ metaAgua: 5000, metaEnergia: 300 });
  const [editarMeta,   setEditarMeta]   = useState(false);
  const [metaTemp,     setMetaTemp]     = useState({ metaAgua: 5000, metaEnergia: 300 });
  const [aba,          setAba]          = useState('mensal');

  useEffect(() => {
    const registros = buscarRegistros();
    const metaSalva = buscarMeta();
    setMeta_(metaSalva);
    setMetaTemp(metaSalva);

    const totais        = buscarTotaisMensais();
    const mesesOrdenados = Object.keys(totais).sort();
    setDadosMensais(
      mesesOrdenados.map((chave) => ({
        mes:     rotuloMes(chave),
        agua:    totais[chave].agua,
        energia: totais[chave].energia,
      }))
    );

    const corte  = new Date();
    corte.setDate(corte.getDate() - 30);
    const recentes = registros
      .filter((r) => new Date(r.data + 'T00:00:00') >= corte)
      .sort((a, b) => a.data.localeCompare(b.data));
    setDadosDiarios(
      recentes.map((r) => ({ dia: r.data.slice(5), agua: r.agua, energia: r.energia }))
    );
  }, []);

  const salvarMetas = () => {
    const novasMetas = {
      metaAgua:    Math.max(0, Number(metaTemp.metaAgua)    || 0),
      metaEnergia: Math.max(0, Number(metaTemp.metaEnergia) || 0),
    };
    salvarMeta(novasMetas);
    setMeta_(novasMetas);
    setEditarMeta(false);
  };

  const registros    = buscarRegistros();
  const residenciais = registros.filter((r) => r.tipo === 'residencial');
  const comerciais   = registros.filter((r) => r.tipo === 'comercial');
  const dadosPizza   = [
    { name: 'Residencial', value: residenciais.reduce((s, r) => s + r.agua, 0) },
    { name: 'Comercial',   value: comerciais.reduce((s, r) => s + r.agua, 0) },
  ].filter((d) => d.value > 0);

  const mediaAgua    = registros.length ? registros.reduce((s, r) => s + r.agua, 0)    / registros.length : 0;
  const mediaEnergia = registros.length ? registros.reduce((s, r) => s + r.energia, 0) / registros.length : 0;
  const semDados     = dadosMensais.length === 0 && dadosDiarios.length === 0;

  return (
    <main className="px-4 py-6 md:py-8 max-w-4xl mx-auto">
      <header className="mb-6 flex items-start justify-between fade-in-up">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-water-500 mb-1">Análise</p>
          <h1 className="text-2xl font-extrabold text-slate-800">Estatísticas</h1>
        </div>
        <button onClick={() => setEditarMeta((v) => !v)}
          className="text-xs font-semibold text-water-600 hover:text-water-800 bg-water-50 hover:bg-water-100 px-3 py-2 rounded-xl transition-colors">
          Metas
        </button>
      </header>

      {editarMeta && (
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4 fade-in-up">
          <h2 className="font-bold text-slate-700 mb-4">Metas Mensais</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Meta de Água (L)</label>
              <input type="number" min="0" value={metaTemp.metaAgua}
                onChange={(e) => setMetaTemp((p) => ({ ...p, metaAgua: e.target.value }))}
                className="w-full py-2 px-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-water-200" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Meta de Energia (kWh)</label>
              <input type="number" min="0" value={metaTemp.metaEnergia}
                onChange={(e) => setMetaTemp((p) => ({ ...p, metaEnergia: e.target.value }))}
                className="w-full py-2 px-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-water-200" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={salvarMetas} className="px-4 py-2 text-sm font-semibold bg-water-600 text-white rounded-xl hover:bg-water-700">Salvar</button>
            <button onClick={() => setEditarMeta(false)} className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">Cancelar</button>
          </div>
        </section>
      )}

      {registros.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 fade-in-up fade-in-up-delay-1">
          {[
            { rotulo: 'Média/registro Água',    valor: `${mediaAgua.toFixed(0)} L`,      fundo: 'bg-water-50',   texto: 'text-water-700' },
            { rotulo: 'Média/registro Energia', valor: `${mediaEnergia.toFixed(1)} kWh`, fundo: 'bg-energy-50',  texto: 'text-energy-700' },
            { rotulo: 'Total de Registros',     valor: registros.length,                 fundo: 'bg-slate-50',   texto: 'text-slate-700' },
            { rotulo: 'Meses registrados',      valor: dadosMensais.length,              fundo: 'bg-emerald-50', texto: 'text-emerald-700' },
          ].map((cartao) => (
            <div key={cartao.rotulo} className={`${cartao.fundo} rounded-xl p-3 text-center`}>
              <p className={`text-lg font-extrabold ${cartao.texto}`}>{cartao.valor}</p>
              <p className="text-xs text-slate-400 mt-0.5">{cartao.rotulo}</p>
            </div>
          ))}
        </div>
      )}

      {semDados ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100 fade-in-up">
          <p className="text-slate-400">Nenhum dado para exibir.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4 fade-in-up fade-in-up-delay-1">
            {[
              { chave: 'mensal', rotulo: 'Por Mês'  },
              { chave: 'diario', rotulo: 'Por Dia'  },
              { chave: 'tipo',   rotulo: 'Por Tipo' },
            ].map((t) => (
              <button key={t.chave} onClick={() => setAba(t.chave)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  aba === t.chave ? 'bg-water-600 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}>
                {t.rotulo}
              </button>
            ))}
          </div>

          {aba === 'mensal' && dadosMensais.length > 0 && (
            <div className="space-y-4 fade-in-up">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h2 className="font-bold text-slate-700 mb-4">Consumo de Água por Mês (L)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dadosMensais} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<TooltipPersonalizado suffix="L" />} />
                    <Bar dataKey="agua" name="Água" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h2 className="font-bold text-slate-700 mb-4">Consumo de Energia por Mês (kWh)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dadosMensais} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<TooltipPersonalizado suffix="kWh" />} />
                    <Bar dataKey="energia" name="Energia" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {aba === 'diario' && (
            <div className="fade-in-up">
              {dadosDiarios.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100">
                  <p className="text-slate-400 text-sm">Nenhum registro nos últimos 30 dias.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <h2 className="font-bold text-slate-700 mb-4">Consumo Diário — últimos 30 dias</h2>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={dadosDiarios}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="esquerda" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="direita" orientation="right" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line yAxisId="esquerda" type="monotone" dataKey="agua"    name="Água (L)"     stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line yAxisId="direita"  type="monotone" dataKey="energia" name="Energia (kWh)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {aba === 'tipo' && (
            <div className="fade-in-up">
              {dadosPizza.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100">
                  <p className="text-slate-400 text-sm">Sem dados suficientes para distribuição.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <h2 className="font-bold text-slate-700 mb-4">Distribuição de Água por Tipo de Consumo</h2>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={dadosPizza} cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                        dataKey="value" nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {dadosPizza.map((_, i) => (
                          <Cell key={i} fill={CORES_PIZZA_AGUA[i % CORES_PIZZA_AGUA.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v.toLocaleString('pt-BR')} L`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
