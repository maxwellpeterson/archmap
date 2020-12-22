import { createGlobalStyle } from "styled-components"
import { normalize } from "styled-normalize"
import "fontsource-roboto"

const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Roboto;
  }
`

const MyApp = ({ Component, pageProps }) => (
  <>
    <GlobalStyle />
    <Component {...pageProps} />
  </>
)

export default MyApp
