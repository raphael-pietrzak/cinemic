import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const [searchNumber, setSearchNumber] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch(`http://localhost:3000/api/cards/${searchNumber}`)
      if (!response.ok) {
        throw new Error('Carte non trouvée')
      }
      navigate(`/card/${searchNumber}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            placeholder="Entrez un numéro de carte"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 text-center text-lg"
          />
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Rechercher
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}

export default App
