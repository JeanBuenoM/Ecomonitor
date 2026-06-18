import React from 'react';

function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function CartaoRegistro({ registro, aoExcluir, compacto = false }) {
  const { id, data, agua, energia, tipo, observacoes } = registro;

  const estiloTipo  = tipo === 'comercial' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700';
  const rotuloTipo  = tipo === 'comercial' ? 'Comercial' : 'Residencial';

  if (compacto) {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
        <div>
          <p className="text-sm font-medium text-slate-700">{formatarData(data)}</p>
          <p className="text-xs text-slate-400">{rotuloTipo}</p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-sm font-semibold text-water-600">{agua.toLocaleString('pt-BR')} L</p>
            <p className="text-xs text-slate-400">Água</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-energy-600">{energia.toLocaleString('pt-BR')} kWh</p>
            <p className="text-xs text-slate-400">Energia</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-slate-800">{formatarData(data)}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${estiloTipo}`}>
            {rotuloTipo}
          </span>
        </div>
        {aoExcluir && (
          <button
            onClick={() => aoExcluir(id)}
            className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
            aria-label="Excluir registro"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-water-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0ea5e9" className="w-4 h-4">
              <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 011.032 0 11.209 11.209 0 007.877 3.08.75.75 0 01.722.515 12.74 12.74 0 01.635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 01-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.189-2.737.535-4.018a.75.75 0 01.72-.511 11.21 11.21 0 007.98-3.051z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-water-600 font-medium">Água</span>
          </div>
          <p className="text-xl font-bold text-water-700">{agua.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-slate-400">litros</p>
        </div>
        <div className="bg-energy-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" className="w-4 h-4">
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-energy-600 font-medium">Energia</span>
          </div>
          <p className="text-xl font-bold text-energy-700">{energia.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-slate-400">kWh</p>
        </div>
      </div>

      {observacoes && (
        <p className="mt-3 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 italic">
          "{observacoes}"
        </p>
      )}
    </article>
  );
}
