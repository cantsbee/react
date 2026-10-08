export default function About (){
    return(
        <section className="about container">
            <div className="about-grid">
                <div className="about-text">
                    <h1>Acerca de nosotros</h1>
                    <p>
                        En Estudio Girasol somos un equipo de artistas especializados en tatuaje
                        tradicional y personalizado. Nuestra filosofía combina creatividad,
                        higiene estricta y atención al detalle para transformar tus ideas en
                        piezas únicas que duran toda la vida.
                    </p>
                    <p>
                        Trabajamos por cita previa y ofrecemos asesoría de diseño gratuita
                        para ayudarte a elegir tamaño, ubicación y estilo que mejor se
                        adapten a tu cuerpo y personalidad.
                    </p>
                    <ul className="about-features">
                        <li>Estudio certificado y esterilizado</li>
                        <li>Artistas con experiencia</li>
                        <li>Diseños personalizados</li>
                        <li>Atención post-tatuaje</li>
                    </ul>
                </div>
                <div className="about-image">
                    <img src="/src/components/" alt="artista trabajando" />
                </div>
            </div>
        </section>
    )
}