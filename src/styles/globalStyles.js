import 'react-toastify/dist/ReactToastify.css';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;   
    padding: 0;
    font-family: 'Poppins', sans-serif;
    outline: none;
    text-decoration: none;
  }

  html, body {
    overflow-x: hidden; /* Previne scroll horizontal */
    max-width: 100vw;
    width: 100%;
  }

  body {
    background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Container principal para evitar overflow */
  #root {
    max-width: 100vw;
    overflow-x: hidden;
    width: 100%;
  }

  a {
    color: #007bff;
  }

  button {
    cursor: pointer;
  }

  input, button {
    background-color: inherit;
  }

  /* Tabelas responsivas - scroll interno */
  .table-wrapper {
    width: 100%;
    overflow-x: auto;
    overflow-y: auto;
    max-height: 70vh; /* Altura máxima para scroll vertical */
    background: #232a36;
    border-radius: 12px;
    box-shadow: 0 2px 16px #10131a33;
    
    /* Estilização da barra de scroll */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #181c24;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #00b4d8;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #0077b6;
    }
    
    /* Tabela dentro do wrapper */
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px; /* Largura mínima para funcionalidade completa */
      
      th, td {
        padding: 12px 10px;
        text-align: left;
        border-bottom: 1px solid #2a3441;
        white-space: nowrap;
      }
      
      th {
        background: #181c24;
        color: #00eaff;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      td {
        color: #eaf6fb;
        
        &.nome-item {
          font-weight: 600;
          font-size: 1.1em;
          color: #00eaff;
        }
        
        &:last-child {
          display: flex;
          gap: 4px;
          justify-content: flex-start;
          align-items: center;
        }
      }
      
      tr:hover {
        background-color: rgba(0, 180, 216, 0.1);
      }
    }
  }

  /* Responsividade para gráficos */
  .chart-responsive {
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
    overflow: hidden !important;
    position: relative !important;
  }
  
  .chart-container {
    width: 100% !important;
    max-width: 100% !important;
    overflow: hidden !important;
    position: relative !important;
    
    canvas, svg {
      max-width: 100% !important;
      height: auto !important;
      width: 100% !important;
      display: block !important;
    }
    
    canvas {
      /* Força redimensionamento no mobile */
      touch-action: manipulation !important;
      image-rendering: -webkit-optimize-contrast !important;
      image-rendering: optimize-contrast !important;
    }
  }
  
  /* Força atualização de gráficos em mudança de orientação */
  @media screen and (orientation: portrait) {
    .chart-container canvas {
      max-width: 100vw !important;
    }
  }
  
  @media screen and (orientation: landscape) {
    .chart-container canvas {
      max-width: 100vw !important;
    }
  }

  /* Botões de paginação globais */
  .paginacao-btn {
    background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 18px;
    margin: 0 4px;
    font-weight: 600;
    font-size: 1rem;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 2px 8px #10131a33;
    outline: none;
  }
  .paginacao-btn:disabled {
    background: #232a36;
    color: #b2bac2;
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
  }
  .paginacao-btn:not(:disabled):hover {
    background: linear-gradient(135deg, #0077b6 0%, #00b4d8 100%);
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 4px 16px #00b4d855;
  }

  /* Responsividade mobile */
  @media (max-width: 768px) {
    .table-wrapper {
      max-height: 60vh;
      
      table {
        min-width: 500px;
        
        th, td {
          padding: 8px;
          font-size: 0.9rem;
        }
      }
    }
    
    .chart-container {
      padding: 8px !important;
    }
    
    .paginacao-btn {
      padding: 4px 12px;
      font-size: 0.9rem;
      margin: 0 2px;
    }
  }
  
  @media (max-width: 480px) {
    .table-wrapper {
      max-height: 50vh;
      
      table {
        min-width: 400px;
        
        th, td {
          padding: 6px;
          font-size: 0.8rem;
        }
      }
    }
    
    .chart-container {
      padding: 6px !important;
    }
  }
`;

export default GlobalStyles;
