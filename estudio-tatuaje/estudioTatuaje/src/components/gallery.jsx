import { useEffect, useState } from 'react'
import styled from 'styled-components'

import ImageCard from './ImageCard.jsx'
import { getGallery } from '../api/client.js'

// Fallback local si la API no está disponible
import mujer from './mujer.png'
import cuervo from './cuervo.png'

const fallbackImages = [
  { _id: 'local-1', url: mujer, title: 'mujer', category: 'grabado' },
  { _id: 'local-2', url: cuervo, title: 'cuervo', category: 'grabado' },
]

const Section = styled.section`
  padding: 2rem 1rem;

  @media (min-width: 900px) {
    padding: 3rem 0;
  }
`
const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.green};

  small {
    font-size: 0.7rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.muted};
  }
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;

  @media (min-width: 900px) {
    .image-wrap {
      padding-top: 70%;
    }
  }
`

export default function Gallery() {
  const [images, setImages] = useState(fallbackImages)
  const [fromApi, setFromApi] = useState(false)

  useEffect(() => {
    let cancelled = false
    getGallery()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setImages(data)
          setFromApi(true)
        }
      })
      .catch(() => {
        // API no disponible: se mantienen las imágenes locales
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Section id="galeria">
      <Title>
        Galería {fromApi && <small>(desde la base de datos)</small>}
      </Title>
      <Grid>
        {images.map((image, i) => (
          <ImageCard
            key={image._id}
            index={i}
            image={image.url}
            title={image.title}
            description={image.category}
          />
        ))}
      </Grid>
    </Section>
  )
}
