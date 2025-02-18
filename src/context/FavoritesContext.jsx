import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (coin) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === coin.id)
      if (isFavorite) {
        return prev.filter(fav => fav.id !== coin.id)
      } else {
        // Sadece gerekli verileri saklayalım
        const coinData = {
          id: coin.id,
          name: coin.name,
          image: coin.image?.large || coin.image, // Detay sayfasından veya liste sayfasından gelen veriye göre uyarla
          current_price: coin.market_data?.current_price.usd || coin.current_price,
          symbol: coin.symbol
        }
        return [...prev, coinData]
      }
    })
  }

  const isFavorite = (coinId) => {
    return favorites.some(fav => fav.id === coinId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext) 