import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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
    <div className="min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
      >
        ← Retour
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {card && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <h2 className="text-xl font-bold p-4 bg-gray-50">{card.title}</h2>
          
          {card.image && (
            <img 
              src={card.image} 
              alt={card.title}
              className="w-full object-cover"
            />
          )}
          
          {card.video && (
            <video controls className="w-full">
              <source src={card.video} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          )}
          
          {card.audio && (
            <audio controls className="w-full px-4 py-2">
              <source src={card.audio} type="audio/mpeg" />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          )}
        </div>
      )}
    </div>
  )
}
