import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Card from '../components/Card'

export default function CardDetail() {
  const [card, setCard] = useState(null)
  const [error, setError] = useState('')
  const { cardId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/cards/${cardId}`)
        if (!response.ok) {
          throw new Error('Carte non trouvée')
        }
        const data = await response.json()
        setCard(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchCard()
  }, [cardId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 flex flex-col">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </button>

      {error && (
        <div className="w-full max-w-md mx-auto bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {card && (
        <div className="flex-1 flex items-center justify-center">
          <Card {...card} />
        </div>
      )}
    </div>
  )
}
