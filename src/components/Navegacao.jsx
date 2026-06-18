import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const itensMenu = [
  {
    para: '/',
    rotulo: 'Painel',
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
      </svg>
    ),
  },
  {
    para: '/registrar',
    rotulo: 'Registrar',
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    para: '/historico',
    rotulo: 'Histórico',
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 14.25a.75.75 0 000 1.5H15a.75.75 0 000-1.5H9.75zm0-3.75a.75.75 0 000 1.5H15a.75.75 0 000-1.5H9.75z" clipRule="evenodd" />
        <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
      </svg>
    ),
  },
  {
    para: '/estatisticas',
    rotulo: 'Estatísticas',
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
      </svg>
    ),
  },
];

export default function Navegacao() {
  const estiloLink = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive ? 'bg-water-600 text-white shadow-md' : 'text-slate-500 hover:bg-water-50 hover:text-water-700'
    }`;

  const estiloLinkMobile = ({ isActive }) =>
    `flex flex-col items-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
      isActive ? 'text-water-600' : 'text-slate-400'
    }`;

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white border-r border-slate-100 shadow-sm px-4 py-6 fixed left-0 top-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-9 h-9 bg-gradient-to-br from-water-500 to-water-700 rounded-xl flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 011.032 0 11.209 11.209 0 007.877 3.08.75.75 0 01.722.515 12.74 12.74 0 01.635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 01-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.189-2.737.535-4.018a.75.75 0 01.72-.511 11.21 11.21 0 007.98-3.051z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-water-800 text-base leading-tight">EcoMonitor</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Água &amp; Energia</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {itensMenu.map((item) => (
            <NavLink key={item.para} to={item.para} end={item.para === '/'} className={estiloLink}>
              {item.icone}
              {item.rotulo}
            </NavLink>
          ))}
        </nav>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-lg z-50">
        <ul className="flex justify-around items-center py-1">
          {itensMenu.map((item) => (
            <li key={item.para}>
              <NavLink to={item.para} end={item.para === '/'} className={estiloLinkMobile}>
                {item.icone}
                {item.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
