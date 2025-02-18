import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FavoritesProvider } from './context/FavoritesContext'
import CoinList from './components/CoinList'
import CoinDetail from './components/CoinDetail'
import Navbar from './components/Navbar'
import FavoritesSidebar from './components/FavoritesSidebar'
import Footer from './components/Footer'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <div className="content-with-sidebar">
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<CoinList />} />
                  <Route path="/coin/:id" element={<CoinDetail />} />
                </Routes>
                <Footer />
              </main>
              <FavoritesSidebar />
            </div>
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </QueryClientProvider>
  )
}

export default App
