import styled from 'styled-components'
import { motion } from 'framer-motion'

const Card = styled(motion.div)`
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.card}, transparent);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.card};
    transform: translateY(-6px);
  }
  transition: box-shadow 200ms ease, transform 200ms ease;
`

const ImageWrap = styled.div`
  width: 100%;
  padding-top: 75%;
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};
  background: linear-gradient(180deg, #fff6e0, #f0e3c6);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 300ms ease;
  }

  ${Card}:hover & img {
    transform: scale(1.08);
  }
`

const Meta = styled.div`
  padding: 0.6rem;
  text-align: left;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.green};
  }
  p {
    margin: 0.25rem 0 0;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.9rem;
  }
`

export default function ImageCard({ image, title, description, index = 0 }) {
  return (
    <Card
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
    >
      <ImageWrap>
        <img src={image} alt={title} loading="lazy" />
      </ImageWrap>
      <Meta>
        <h3>{title}</h3>
        <p>{description}</p>
      </Meta>
    </Card>
  )
}
