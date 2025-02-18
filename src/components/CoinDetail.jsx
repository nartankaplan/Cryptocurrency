import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useFavorites } from '../context/FavoritesContext'
import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import axios from 'axios'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function CoinDetail() {
  const { id } = useParams()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [timeRange, setTimeRange] = useState('30')

  const { data: coin, isLoading: isLoadingCoin, error: coinError } = useQuery({
    queryKey: ['coin', id],
    queryFn: () =>
      axios
        .get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false`)
        .then((res) => res.data),
  })

  const { data: chartData, isLoading: isLoadingChart } = useQuery({
    queryKey: ['chart', id, timeRange],
    queryFn: () =>
      axios
        .get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${timeRange}`)
        .then((res) => res.data),
  })

  if (isLoadingCoin || isLoadingChart) return <div>Loading...</div>
  if (coinError) return <div>Error: {coinError.message}</div>

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${timeRange === '365' ? '1 Year' : timeRange === '30' ? '30 Days' : '7 Days'} Price History`,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString()
          }
        }
      }
    }
  }

  const priceData = {
    labels: chartData?.prices.map(price => 
      new Date(price[0]).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Price',
        data: chartData?.prices.map(price => price[1]),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  return (
    <div className="coin-detail">
      <div className="coin-header">
        <img src={coin.image.large} alt={coin.name} />
        <div className="coin-title-wrapper">
          <h1>{coin.name}</h1>
          <button
            onClick={() => toggleFavorite(coin)}
            className={`favorite-button ${isFavorite(coin.id) ? 'is-favorite' : ''}`}
          >
            {isFavorite(coin.id) ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>
      
      <div className="coin-info">
        <p>
          <strong>Market Rank:</strong> #{coin.market_cap_rank}
        </p>
        <p>
          <strong>Price (USD):</strong> ${coin.market_data.current_price.usd}
        </p>
        <p>
          <strong>24h Change:</strong>{' '}
          <span
            className={
              coin.market_data.price_change_percentage_24h > 0
                ? 'price-up'
                : 'price-down'
            }
          >
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </span>
        </p>
        <p>
          <strong>7d Change:</strong>{' '}
          <span
            className={
              coin.market_data.price_change_percentage_7d > 0
                ? 'price-up'
                : 'price-down'
            }
          >
            {coin.market_data.price_change_percentage_7d.toFixed(2)}%
          </span>
        </p>
        <p>
          <strong>30d Change:</strong>{' '}
          <span
            className={
              coin.market_data.price_change_percentage_30d > 0
                ? 'price-up'
                : 'price-down'
            }
          >
            {coin.market_data.price_change_percentage_30d.toFixed(2)}%
          </span>
        </p>
        <p>
          <strong>1y Change:</strong>{' '}
          <span
            className={
              coin.market_data.price_change_percentage_1y > 0
                ? 'price-up'
                : 'price-down'
            }
          >
            {coin.market_data.price_change_percentage_1y.toFixed(2)}%
          </span>
        </p>
        <p>
          <strong>Market Cap:</strong> ${coin.market_data.market_cap.usd.toLocaleString()}
        </p>
        <p>
          <strong>24h Volume:</strong> ${coin.market_data.total_volume.usd.toLocaleString()}
        </p>
      </div>

      <div className="chart-container">
        <div className="time-range-selector">
          <button
            className={timeRange === '7' ? 'active' : ''}
            onClick={() => setTimeRange('7')}
          >
            7 Days
          </button>
          <button
            className={timeRange === '30' ? 'active' : ''}
            onClick={() => setTimeRange('30')}
          >
            30 Days
          </button>
          <button
            className={timeRange === '365' ? 'active' : ''}
            onClick={() => setTimeRange('365')}
          >
            1 Year
          </button>
        </div>
        <div className="price-chart">
          <Line options={chartOptions} data={priceData} />
        </div>
      </div>

      <div className="coin-description">
        <h2>About</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: coin.description.en,
          }}
        />
      </div>
    </div>
  )
}

export default CoinDetail 