import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { FaHeart } from 'react-icons/fa'

function FavoritesSidebar() {
  const { favorites, toggleFavorite } = useFavorites()

  return (
    <div className="favorites-sidebar">
      <h2>Favorite Coins</h2>
      {favorites.length === 0 ? (
        <p className="no-favorites">You haven't added any favorite coins yet</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((coin) => (
            <div key={coin.id} className="favorite-item">
              <Link to={`/coin/${coin.id}`} className="favorite-coin-info">
                <img 
                  src={coin.image} 
                  alt={coin.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'fallback-image-url.png'; 
                  }}
                />
                <span>{coin.name}</span>
                <span className="favorite-price">
                  ${typeof coin.current_price === 'number' 
                    ? coin.current_price.toLocaleString() 
                    : coin.current_price}
                </span>
              </Link>
              <button
                onClick={() => toggleFavorite(coin)}
                className="remove-favorite"
              >
                <FaHeart />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesSidebar 
