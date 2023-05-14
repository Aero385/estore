import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter&family=Roboto:ital@1&family=Rubik:wght@400;500;700&display=swap');
  body{
    padding: 0;
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles/>
      <Component {...pageProps} />
    </>
  )
}
