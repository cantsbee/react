import { NavLink } from 'react-router-dom'

export default function Header() {
    return (
        <header className="site-header">
            <div className="site-header-inner container">
                <h1 className="site-title">Estudio Girasol </h1>
                <nav>
                    <ul className="site-nav">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                        
                    </ul>
                </nav>
            </div>
        </header>
    )
}