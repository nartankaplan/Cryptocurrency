import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-title">
        Cryptocurrency Exchange
      </Link>
    </nav>
  )
}

export default Navbar 