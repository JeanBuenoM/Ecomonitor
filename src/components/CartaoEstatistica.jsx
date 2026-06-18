import React from 'react';

export default function CartaoEstatistica({ rotulo, valor, unidade, meta, cor = 'water', icone, tendencia, atraso = 0 }) {
  const porcentagem   = meta > 0 ? Math.min((valor / meta) * 100, 100) : 0;
  const raio          = 40;
  const circunferencia = 2 * Math.PI * raio;
  const deslocamento   = circunferencia - (porcentagem / 100) * circunferencia;

  const cores = {
    water: {
      traco:    '#0ea5e9',
      fundo:    '#e0f2fe',
      emblema:  'bg-water-100 text-water-700',
      texto:    'text-water-700',
    },
    energy: {
      traco:    '#f59e0b',
      fundo:    '#fef3c7',
      emblema:  'bg-energy-100 text-energy-700',
      texto:    'text-energy-700',
    },
  };
  const c = cores[cor];

  const classeAtraso = ['', 'fade-in-up-delay-1', 'fade-in-up-delay-2', 'fade-in-up-delay-3', 'fade-in-up-delay-4'][atraso] || '';

  const rotuloTendencia =
    tendencia == null ? null : tendencia > 0
      ? `+${tendencia.toFixed(1)}% vs mês anterior`
      : tendencia < 0
      ? `${tendencia.toFixed(1)}% vs mês anterior`
      : 'Igual ao mês anterior';

  const corTendencia = tendencia > 0 ? 'text-red-500' : tendencia < 0 ? 'text-emerald-500' : 'text-slate-400';

  return (
    <article className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 fade-in-up ${classeAtraso}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3 ${c.emblema}`}>
            {icone}
            {rotulo}
          </div>

          <p className={`text-4xl font-extrabold leading-none ${c.texto}`}>
            {valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
            <span className="text-base font-medium text-slate-400 ml-1">{unidade}</span>
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Meta mensal: {meta.toLocaleString('pt-BR')} {unidade}
          </p>

          {rotuloTendencia && (
            <p className={`text-xs mt-2 font-medium ${corTendencia}`}>
              {tendencia > 0 ? '▲' : tendencia < 0 ? '▼' : '–'} {rotuloTendencia}
            </p>
          )}
        </div>

        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={raio} fill="none" stroke={c.fundo} strokeWidth="10" />
            <circle
              cx="50" cy="50" r={raio}
              fill="none"
              stroke={c.traco}
              strokeWidth="10"
              strokeLinecap="round"
              className="gauge-circle"
              style={{ '--target-offset': deslocamento }}
              strokeDasharray={circunferencia}
              strokeDashoffset={deslocamento}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
            {porcentagem.toFixed(0)}%
          </span>
        </div>
      </div>
    </article>
  );
}
