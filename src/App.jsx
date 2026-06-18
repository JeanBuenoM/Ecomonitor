import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navegacao    from './components/Navegacao';
import Painel       from './pages/Painel';
import Registrar    from './pages/Registrar';
import Historico    from './pages/Historico';
import Estatisticas from './pages/Estatisticas';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-water-50">
        <Navegacao />
        <div className="md:ml-60 pb-20 md:pb-0">
          <Routes>
            <Route path="/"             element={<Painel       />} />
            <Route path="/registrar"    element={<Registrar    />} />
            <Route path="/historico"    element={<Historico    />} />
            <Route path="/estatisticas" element={<Estatisticas />} />
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <h2 className="text-2xl font-bold text-slate-700 mb-2">Página não encontrada</h2>
                  <a href="/" className="mt-4 text-water-600 font-semibold hover:underline">Voltar ao Painel</a>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
