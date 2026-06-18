# EcoMonitor

Aplicação web em React para monitorar consumo de água e energia elétrica. Registre o consumo diário, acompanhe o histórico, visualize gráficos mensais e defina metas. Os dados ficam salvos no navegador e o clima atual é carregado de uma API externa.

Funcionalidades

* Painel com resumo do mês e indicadores de consumo vs. meta
* Registro diário de água (L) e energia (kWh) com validação em JavaScript puro
* Histórico com filtros por tipo e período, busca e exportação para CSV
* Gráficos mensais, diários e por tipo de consumo
* Editor de metas mensais de água e energia
* Clima em tempo real via API Open-Meteo

Tecnologias

* React 18 e Vite
* React Router v6
* Tailwind CSS e Recharts
* Fetch API (Open-Meteo) e LocalStorage

Como rodar

Precisa do Node.js 18+.


git clone https://github.com/JeanBuenoM/Ecomonitor.git
cd ecomonitor
npm install
npm run dev


Acesse o endereço que aparecer no terminal (normalmente http://localhost:5173).

Arquivos


src/
  components/   Navbar, StatCard, RecordCard, WeatherCard
  pages/        Dashboard, Register, History, Statistics
  utils/        storage.js
  App.jsx       rotas da aplicação
  main.jsx      ponto de entrada
  index.css     estilos e animações