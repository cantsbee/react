
import './App.css'
import Hero from './components/Hero.jsx'

import { Outlet } from 'react-router-dom' 

function App() {
  return (
    <div className="App">
    
      <Hero />
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}

export default App
