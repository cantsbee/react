
import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/footer.jsx'

import { Outlet } from 'react-router-dom' 

function App() {
  return (
    <div className="App">
      <Header />
      <Footer />
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}

export default App
