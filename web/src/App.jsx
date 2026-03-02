import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Users } from './pages/Users'
import { Items } from './pages/Items'
import { Home } from './pages/Home'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/users">Users</Link>
          <Link to="/items">Items</Link>
        </nav>
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/items" element={<Items />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
