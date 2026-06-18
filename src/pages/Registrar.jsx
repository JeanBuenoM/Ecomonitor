import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { salvarRegistro } from '../utils/armazenamento';

const CAMPOS_INICIAIS = {
  data:        new Date().toISOString().slice(0, 10),
  agua:        '',
  energia:     '',
  tipo:        'residencial',
  observacoes: '',
};

function validar(campos) {
  const erros = {};

  if (!campos.data) {
    erros.data = 'A data é obrigatória.';
  } else if (new Date(campos.data + 'T00:00:00') > new Date()) {
    erros.data = 'A data não pode ser no futuro.';
  }

  const agua = Number(campos.agua);
  if (!campos.agua)                    erros.agua = 'Informe o consumo de água.';
  else if (isNaN(agua) || agua < 0)    erros.agua = 'Valor inválido para consumo de água.';
  else if (agua > 100_000)             erros.agua = 'Valor muito alto. Verifique o campo.';

  const energia = Number(campos.energia);
  if (!campos.energia)                       erros.energia = 'Informe o consumo de energia.';
  else if (isNaN(energia) || energia < 0)    erros.energia = 'Valor inválido para consumo de energia.';
  else if (energia > 10_000)                 erros.energia = 'Valor muito alto. Verifique o campo.';

  if (campos.observacoes.length > 300) erros.observacoes = 'Máximo de 300 caracteres.';

  return erros;
}

function ErroFormulario({ mensagem }) {
  if (!mensagem) return null;
  return <p className="text-red-500 text-xs mt-1">{mensagem}</p>;
}

export default function Registrar() {
  const [campos,  setCampos]  = useState(CAMPOS_INICIAIS);
  const [erros,   setErros]   = useState({});
  const [enviado, setEnviado] = useState(false);
  const [tocado,  setTocado]  = useState({});
  const navegar = useNavigate();

  const aoAlterar = (e) => {
    const { name, value } = e.target;
    setCampos((anterior) => ({ ...anterior, [name]: value }));
    if (tocado[name]) {
      setErros((anterior) => ({ ...anterior, ...validar({ ...campos, [name]: value }) }));
    }
  };

  const aoSairFoco = (e) => {
    const { name } = e.target;
    setTocado((anterior) => ({ ...anterior, [name]: true }));
    setErros((anterior) => ({ ...anterior, ...validar(campos) }));
  };

  const aoEnviar = (e) => {
    e.preventDefault();
    const todosTocados = Object.fromEntries(Object.keys(CAMPOS_INICIAIS).map((k) => [k, true]));
    setTocado(todosTocados);
    const errosEncontrados = validar(campos);
    setErros(errosEncontrados);
    if (Object.keys(errosEncontrados).length > 0) return;
    salvarRegistro(campos);
    setEnviado(true);
  };

  const aoNovo = () => {
    setCampos(CAMPOS_INICIAIS);
    setErros({});
    setTocado({});
    setEnviado(false);
  };

  const estiloInput = (campo) =>
    `w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none ${
      erros[campo] && tocado[campo]
        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
        : 'border-slate-200 bg-white focus:ring-2 focus:ring-water-200 focus:border-water-400'
    }`;

  if (enviado) {
    return (
      <main className="px-4 py-8 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center fade-in-up">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Registro Salvo!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Consumo de <span className="font-semibold text-water-600">{campos.agua} L</span> de água e{' '}
            <span className="font-semibold text-energy-600">{campos.energia} kWh</span> de energia salvo com sucesso.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={aoNovo} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-water-600 text-white hover:bg-water-700 transition-colors">
              Novo Registro
            </button>
            <button onClick={() => navegar('/historico')} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              Ver Histórico
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 md:py-8 max-w-lg mx-auto">
      <header className="mb-6 fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-water-500 mb-1">Novo Lançamento</p>
        <h1 className="text-2xl font-extrabold text-slate-800">Registrar Consumo</h1>
      </header>

      <form onSubmit={aoEnviar} noValidate className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5 fade-in-up fade-in-up-delay-1">

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="data">
            Data <span className="text-red-500">*</span>
          </label>
          <input
            type="date" id="data" name="data"
            value={campos.data}
            onChange={aoAlterar} onBlur={aoSairFoco}
            className={estiloInput('data')}
            max={new Date().toISOString().slice(0, 10)}
          />
          <ErroFormulario mensagem={tocado.data && erros.data} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="agua">
              Água (L) <span className="text-red-500">*</span>
            </label>
            <input
              type="number" id="agua" name="agua"
              placeholder="0" min="0" step="0.1"
              value={campos.agua}
              onChange={aoAlterar} onBlur={aoSairFoco}
              className={estiloInput('agua')}
            />
            <ErroFormulario mensagem={tocado.agua && erros.agua} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="energia">
              Energia (kWh) <span className="text-red-500">*</span>
            </label>
            <input
              type="number" id="energia" name="energia"
              placeholder="0" min="0" step="0.01"
              value={campos.energia}
              onChange={aoAlterar} onBlur={aoSairFoco}
              className={estiloInput('energia')}
            />
            <ErroFormulario mensagem={tocado.energia && erros.energia} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de Consumo</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { valor: 'residencial', rotulo: 'Residencial' },
              { valor: 'comercial',   rotulo: 'Comercial'   },
            ].map((opcao) => (
              <label
                key={opcao.valor}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                  campos.tipo === opcao.valor
                    ? 'border-water-500 bg-water-50 text-water-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio" name="tipo" value={opcao.valor}
                  checked={campos.tipo === opcao.valor}
                  onChange={aoAlterar}
                  className="sr-only"
                />
                {opcao.rotulo}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="observacoes">
            Observações <span className="text-slate-400 font-normal">(opcional)</span>
          </label>
          <textarea
            id="observacoes" name="observacoes" rows={3}
            value={campos.observacoes}
            onChange={aoAlterar} onBlur={aoSairFoco}
            className={`${estiloInput('observacoes')} resize-none`}
          />
          <div className="flex justify-between mt-1">
            <ErroFormulario mensagem={tocado.observacoes && erros.observacoes} />
            <p className={`text-xs ml-auto ${campos.observacoes.length > 280 ? 'text-red-500' : 'text-slate-300'}`}>
              {campos.observacoes.length}/300
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold bg-water-600 text-white hover:bg-water-700 active:scale-95 transition-all shadow-sm">
            Salvar Registro
          </button>
          <button type="button" onClick={() => setCampos(CAMPOS_INICIAIS)} className="px-4 py-3 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            Limpar
          </button>
        </div>
      </form>
    </main>
  );
}
