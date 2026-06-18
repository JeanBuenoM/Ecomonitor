import React, { useEffect, useState } from 'react';

function descricaoClima(codigo) {
  if (codigo <= 1)  return 'Céu limpo';
  if (codigo <= 3)  return 'Parcialmente nublado';
  if (codigo <= 48) return 'Neblina';
  if (codigo <= 67) return 'Chuva';
  if (codigo <= 77) return 'Neve';
  return               'Tempestade';
}

export default function CartaoClima({ cidade = 'Sua cidade', lat = -23.55, lon = -46.63 }) {
  const [clima,      setClima]      = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState(null);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code` +
      `&timezone=America%2FSao_Paulo`;

    fetch(url)
      .then((resposta) => {
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        return resposta.json();
      })
      .then((dados) => {
        setClima(dados.current);
        setCarregando(false);
      })
      .catch((e) => {
        setErro(e.message);
        setCarregando(false);
      });
  }, [lat, lon]);

  return (
    <article className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 fade-in-up">
      <p className="text-xs font-semibold uppercase tracking-widest text-water-500 mb-3">
        Clima — {cidade}
      </p>

      {carregando && <p className="text-slate-400 text-sm">Carregando...</p>}
      {erro       && <p className="text-slate-400 text-sm">Não foi possível carregar o clima.</p>}

      {clima && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-extrabold text-slate-800">
              {Math.round(clima.temperature_2m)}°C
            </p>
            <p className="text-sm text-slate-500 mt-0.5">{descricaoClima(clima.weather_code)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Sensação</p>
            <p className="font-semibold text-slate-700">{Math.round(clima.apparent_temperature)}°C</p>
            <p className="text-sm text-slate-500 mt-1">Umidade</p>
            <p className="font-semibold text-slate-700">{clima.relative_humidity_2m}%</p>
          </div>
        </div>
      )}
    </article>
  );
}
