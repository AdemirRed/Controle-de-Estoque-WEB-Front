import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

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
    background-color: #3b3b3b;
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
