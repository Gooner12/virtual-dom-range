import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html {
        --padding-top: 7px;
        --padding: 7px 10px;
        --tooltip-color: rgba(55, 55, 55, 0.8);
        --arrow-size: 5px;
    }
`;

export default GlobalStyle;