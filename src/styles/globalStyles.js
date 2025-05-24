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
`;

export default GlobalStyles;
