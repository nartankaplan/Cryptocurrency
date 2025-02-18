import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useFavorites } from '../context/FavoritesContext'
import axios from 'axios'

function CoinList() {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { data: coins, isLoading, error } = useQuery({
    queryKey: ['coins'],
    queryFn: () =>
      axios
        .get(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en'
        )
        .then((res) => res.data),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="coin-list">
      <h1>Cryptocurrencies</h1>
      <div className="coins-grid">
        {coins.map((coin) => (
          <div key={coin.id} className="coin-card">
            <button
              onClick={() => toggleFavorite(coin)}
              className={`favorite-button ${isFavorite(coin.id) ? 'is-favorite' : ''}`}
            >
              {isFavorite(coin.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
            <Link to={`/coin/${coin.id}`} className="coin-link">
              <img src={coin.image} alt={coin.name} className="coin-image" />
              <h2>{coin.name}</h2>
              <p>Price: ${coin.current_price}</p>
              <p
                className={
                  coin.price_change_percentage_24h > 0
                    ? 'price-up'
                    : 'price-down'
                }
              >
                24h Change: {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoinList 