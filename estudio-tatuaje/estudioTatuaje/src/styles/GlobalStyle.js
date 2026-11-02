import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html, body, #root {
    height: 100%;
    margin: 0;
  }

  body {
    font-family: ${({ theme }) => theme.font.body};
    background: ${({ theme }) => theme.colors.bgGradient};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 1126px;
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
    border-inline: 1px solid #e5e4e7;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
  }

  h1, h2 {
    font-family: ${({ theme }) => theme.font.body};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
    background: none;
  }
  h1 { font-size: 56px; letter-spacing: -1.68px; margin: 32px 0; }
  h2 { font-size: 24px; line-height: 118%; letter-spacing: -0.24px; margin: 0 0 8px; }
  p { margin: 0; }

  @media (max-width: 1024px) {
    h1 { font-size: 36px; margin: 20px 0; }
    h2 { font-size: 20px; }
  }

  button {
    font-family: inherit;
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text};
    padding: 0.6rem 1rem;
    border: 0;
    border-radius: ${({ theme }) => theme.radius.md};
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.shadow.soft};
    font-weight: 600;
    transition: filter 150ms ease, transform 150ms ease;
  }
  button:hover:not(:disabled) { filter: brightness(1.05); transform: translateY(-1px); }
  button:disabled { opacity: 0.6; cursor: wait; }

  a { color: inherit; }

  ::selection { background: rgba(245,183,0,0.35); }

  /* Layout (usado por App.jsx) */
  .App {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
  }

  /* About page */
  .about {
    padding: 2.5rem 1rem;
    text-align: left;
  }
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
    align-items: center;
  }
  .about-text h1 {
    margin-top: 0;
    color: ${({ theme }) => theme.colors.green};
  }
  .about-text p {
    color: ${({ theme }) => theme.colors.muted};
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  .about-features {
    list-style: disc;
    margin: 1rem 0 0 1.25rem;
    color: ${({ theme }) => theme.colors.muted};
  }
  .about-image img {
    width: 100%;
    max-width: 320px;
    height: auto;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 10px 28px rgba(47, 107, 47, 0.08);
  }
  @media (max-width: 900px) {
    .about-grid {
      grid-template-columns: 1fr;
    }
    .about-image {
      order: -1;
    }
  }
`

export default GlobalStyle
