const CHAVE_REGISTROS = 'ecomonitor_registros';
const CHAVE_META      = 'ecomonitor_meta';

export function gerarId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

export function buscarRegistros() {
  try {
    const dados = localStorage.getItem(CHAVE_REGISTROS);
    return dados ? JSON.parse(dados) : [];
  } catch {
    return [];
  }
}

export function salvarRegistro(registro) {
  const registros = buscarRegistros();
  const novoRegistro = {
    id:          gerarId(),
    agua:        Number(registro.agua)    || 0,
    energia:     Number(registro.energia) || 0,
    data:        registro.data,
    tipo:        registro.tipo        || 'residencial',
    observacoes: registro.observacoes || '',
    criadoEm:   new Date().toISOString(),
  };
  registros.push(novoRegistro);
  localStorage.setItem(CHAVE_REGISTROS, JSON.stringify(registros));
  return novoRegistro;
}

export function excluirRegistro(id) {
  const registros = buscarRegistros().filter((r) => r.id !== id);
  localStorage.setItem(CHAVE_REGISTROS, JSON.stringify(registros));
}

export function atualizarRegistro(id, atualizacoes) {
  const registros = buscarRegistros().map((r) =>
    r.id === id ? { ...r, ...atualizacoes, atualizadoEm: new Date().toISOString() } : r
  );
  localStorage.setItem(CHAVE_REGISTROS, JSON.stringify(registros));
  return registros.find((r) => r.id === id) || null;
}

export function buscarTotaisMensais() {
  const registros = buscarRegistros();
  const totais = {};
  registros.forEach((r) => {
    const mes = r.data.slice(0, 7);
    if (!totais[mes]) totais[mes] = { agua: 0, energia: 0, registros: 0 };
    totais[mes].agua      += r.agua;
    totais[mes].energia   += r.energia;
    totais[mes].registros += 1;
  });
  return totais;
}

export function buscarTotaisMesAtual() {
  const agora = new Date();
  const mes   = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
  const registros = buscarRegistros().filter((r) => r.data.startsWith(mes));
  return {
    agua:      registros.reduce((s, r) => s + r.agua, 0),
    energia:   registros.reduce((s, r) => s + r.energia, 0),
    registros: registros.length,
  };
}

export function buscarTotaisMesAnterior() {
  const agora     = new Date();
  const anterior  = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
  const mes       = `${anterior.getFullYear()}-${String(anterior.getMonth() + 1).padStart(2, '0')}`;
  const registros = buscarRegistros().filter((r) => r.data.startsWith(mes));
  return {
    agua:    registros.reduce((s, r) => s + r.agua, 0),
    energia: registros.reduce((s, r) => s + r.energia, 0),
  };
}

export function salvarMeta(meta) {
  localStorage.setItem(CHAVE_META, JSON.stringify(meta));
}

export function buscarMeta() {
  try {
    const dados = localStorage.getItem(CHAVE_META);
    return dados ? JSON.parse(dados) : { metaAgua: 5000, metaEnergia: 300 };
  } catch {
    return { metaAgua: 5000, metaEnergia: 300 };
  }
}

export function exportarCSV() {
  const registros = buscarRegistros();
  if (!registros.length) return;
  const cabecalho = ['ID', 'Data', 'Água (L)', 'Energia (kWh)', 'Tipo', 'Observações'];
  const linhas    = registros.map((r) => [r.id, r.data, r.agua, r.energia, r.tipo, `"${r.observacoes}"`]);
  const csv       = [cabecalho.join(','), ...linhas.map((l) => l.join(','))].join('\n');
  const blob      = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url       = URL.createObjectURL(blob);
  const link      = document.createElement('a');
  link.href       = url;
  link.download   = `ecomonitor_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
