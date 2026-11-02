import styled from 'styled-components'

const FooterBar = styled.footer`
  margin-top: auto;
  padding: 2rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;

  h2 {
    margin: 0 0 0.3rem;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.green};
  }
`

export default function Footer() {
  return (
    <FooterBar>
      <h2>Estudio Girasol</h2>
      <p>Tatuaje tradicional y personalizado · Por cita previa</p>
    </FooterBar>
  )
}
