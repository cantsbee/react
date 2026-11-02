import styled from 'styled-components'
import { motion } from 'framer-motion'

const HeroBox = styled.div`
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  text-align: left;

  h1 {
    font-size: 2rem;
    margin: 0;
    color: ${({ theme }) => theme.colors.green};
  }
  p {
    color: ${({ theme }) => theme.colors.text};
    max-width: 60ch;
  }
`

export default function Hero() {
  return (
    <HeroBox as={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Bienvenido a nuestro estudio de tatuajes
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Explora nuestra galería y reserva tu cita hoy mismo.
      </motion.p>
    </HeroBox>
  )
}
