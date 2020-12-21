// Taken from github.com/vercel/next.js/blob/canary/examples/with-styled-components/pages/_app.js

import { createGlobalStyle, ThemeProvider } from "styled-components"
import { normalize } from "styled-normalize"

const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    box-sizing: border-box;
  }
`

// Eventually do stuff with themes...
const theme = {
  colors: {
    primary: "#0070f3",
  },
}

const MyApp = ({ Component, pageProps }) => (
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </>
)

export default MyApp
