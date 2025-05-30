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

  body {
    background-color:rgb(17 24 39 / var(--tw-bg-opacity, 1))
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
`;

export default GlobalStyles;
