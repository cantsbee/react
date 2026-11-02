import styled, { css } from 'styled-components'

// Contenedor de página (centrado, con margen)
export const Page = styled.section`
  padding: 2.5rem 1rem;
  text-align: left;
`

export const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.green};
  text-align: center;
`

export const PageIntro = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  margin: 0 0 1.5rem;
`

// Formulario en grid de 2 columnas
export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 720px;
  margin: 0 auto 2.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.green};

  /* Campo a ancho completo cuando se pide */
  ${({ $full }) =>
    $full &&
    css`
      grid-column: 1 / -1;
    `}
`

const controlStyles = css`
  padding: 0.6rem 0.75rem;
  border: 1px solid #e5e4e7;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 1px;
  }

  ${({ $invalid }) =>
    $invalid &&
    css`
      border-color: ${({ theme }) => theme.colors.danger};
    `}
`

export const Input = styled.input`
  ${controlStyles}
`

export const TextArea = styled.textarea`
  ${controlStyles}
  resize: vertical;
`

export const Select = styled.select`
  ${controlStyles}
`

export const FormError = styled.p`
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.danger};
  margin: 0;
  font-size: 0.9rem;
`

export const FormSuccess = styled.p`
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.green};
  margin: 0;
  font-size: 0.9rem;
`

export const FullButton = styled.button`
  grid-column: 1 / -1;
  justify-self: start;
`

// Mensaje de error inline (bajo un campo)
export const FieldError = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.78rem;
  font-weight: 400;
`
