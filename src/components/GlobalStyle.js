import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`

    @import url("//fonts.googleapis.com/earlyaccess/notosanskr.css");

    .notosanskr * { 
    font-family: 'Noto Sans KR', sans-serif;
    }

    * {
        margin: 0;
        padding: 0;
        font-family: 'Noto Sans KR';
    }
    ul {
        list-style: none;
    }
    a {
        text-decoration: none;
        color: #000;
    }
`;

export default GlobalStyle