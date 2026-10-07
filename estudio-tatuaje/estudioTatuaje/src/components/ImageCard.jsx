export default function ImageCard({ image, title, description }) {
  return (
    <div className="image-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}