import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiImage, FiVideo, FiMusic, FiX } from 'react-icons/fi'

export default function AdminPanel() {
  const [cards, setCards] = useState([])
  const [formData, setFormData] = useState({ title: '', image: '', video: '', audio: '' })
  const [editingCard, setEditingCard] = useState(null)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cards')
      const data = await response.json()
      setCards(data)
    } catch (error) {
      setError('Erreur lors du chargement des cartes')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingCard
        ? `http://localhost:3000/api/admin/cards/${editingCard.id}`
        : 'http://localhost:3000/api/admin/cards'
      
      const method = editingCard ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erreur lors de l\'enregistrement')
      
      await fetchCards()
      setFormData({ title: '', image: '', video: '', audio: '' })
      setEditingCard(null)
      setIsModalOpen(false)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEdit = (card) => {
    setEditingCard(card)
    setFormData(card)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) return
    
    try {
      const response = await fetch(`http://localhost:3000/api/admin/cards/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      
      await fetchCards()
    } catch (error) {
      setError(error.message)
    }
  }

  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const filteredCards = cards.filter(card => {
    if (activeFilters.length === 0) return true
    return activeFilters.some(filter => card[filter])
  })

  const MediaButton = ({ type, icon: Icon, active }) => (
    <button
      onClick={() => toggleFilter(type)}
      className={`p-2 rounded-lg transition-all \${
        active 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administration des Cartes</h1>
          <button
            onClick={() => {
              setEditingCard(null)
              setFormData({ title: '', image: '', video: '', audio: '' })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Nouvelle Carte
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <MediaButton 
            type="image" 
            icon={FiImage} 
            active={activeFilters.includes('image')}
          />
          <MediaButton 
            type="video" 
            icon={FiVideo} 
            active={activeFilters.includes('video')}
          />
          <MediaButton 
            type="audio" 
            icon={FiMusic} 
            active={activeFilters.includes('audio')}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Média</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCards.map(card => (
                <tr key={card.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{card.id}</td>
                  <td className="px-6 py-4">{card.title}</td>
                  <td className="px-6 py-4 flex gap-2">
                    {card.image && <FiImage className="w-5 h-5 text-blue-500" />}
                    {card.video && <FiVideo className="w-5 h-5 text-green-500" />}
                    {card.audio && <FiMusic className="w-5 h-5 text-purple-500" />}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(card)}
                      className="p-2 text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-2 text-red-600 hover:text-red-900 transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-semibold mb-4">
              {editingCard ? 'Modifier la carte' : 'Ajouter une carte'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block mb-1">Vidéo URL</label>
                <input
                  type="text"
                  value={formData.video}
                  onChange={(e) => setFormData({...formData, video: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block mb-1">Audio URL</label>
                <input
                  type="text"
                  value={formData.audio}
                  onChange={(e) => setFormData({...formData, audio: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {editingCard ? 'Mettre à jour' : 'Ajouter'}
                </button>
                
                {editingCard && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCard(null)
                      setFormData({ title: '', image: '', video: '', audio: '' })
                      setIsModalOpen(false)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}