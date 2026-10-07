import ImageCard from '../components/ImageCard.jsx'
import mujer from './mujer.png'
import cuervo from './cuervo.png'

export default function Gallery() {
  const images = [
    {
      id: 1,
      url: mujer,
      title: 'mujer',
      category: 'grabado',
    },
    {
      id: 2,
      url: cuervo,
      title: 'cuervo',
      category: 'grabado',
    },
  ]

  return (
    <section className="gallery" id="galeria">
      <h2 className="gallery-title">Galería</h2>
      <div className="gallery-grid">
        {images.map((image) => (
          <ImageCard key={image.id} image={image.url} title={image.title} description={image.category} />
        ))}
      </div>
    </section>
  )
}
