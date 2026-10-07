
import './App.css'
import Hero from './components/Hero.jsx'
import Header from './components/Header.jsx'

import { Outlet } from 'react-router-dom' 

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      
      
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}

export default App
