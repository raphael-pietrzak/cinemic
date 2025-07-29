import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiEdit2, FiTrash2, FiPlus, FiImage, FiVideo, FiMusic, FiX, FiEye } from 'react-icons/fi'
import Card from '../components/Card'
import { ROUTES } from '../config/api'

export default function AdminPanel() {
  const [cards, setCards] = useState([])
  const [formData, setFormData] = useState({ 
    title: '', 
    category: '',
    tags: [],
    image: '', 
    video: '', 
    audio: '' 
  })
  const [editingCard, setEditingCard] = useState(null)
  const [previewCard, setPreviewCard] = useState(null)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch(ROUTES.CARDS)
      const data = await response.json()
      setCards(data)
    } catch (error) {
      setError('Erreur lors du chargement des cartes')
    }
  }

  const onDrop = useCallback((acceptedFiles, fileType) => {
    // Mise à jour du formData avec le nouveau fichier
    const file = acceptedFiles[0]
    if (file) {
      const newFormData = new FormData()
      newFormData.append(fileType, file)
      setFormData(prev => ({
        ...prev,
        [fileType]: file
      }))
    }
  }, [])

  const { getRootProps: getImageProps, getInputProps: getImageInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (files) => onDrop(files, 'image'),
    maxFiles: 1
  })

  const { getRootProps: getVideoProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: { 'video/*': [] },
    onDrop: (files) => onDrop(files, 'video'),
    maxFiles: 1
  })

  const { getRootProps: getAudioProps, getInputProps: getAudioInputProps } = useDropzone({
    accept: { 'audio/*': [] },
    onDrop: (files) => onDrop(files, 'audio'),
    maxFiles: 1
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingCard
        ? `${ROUTES.ADMIN_CARDS}/${editingCard.id}`
        : ROUTES.ADMIN_CARDS
      
      const method = editingCard ? 'PUT' : 'POST'
      
      const form = new FormData()
      form.append('title', formData.title)
      form.append('category', formData.category)
      form.append('tags', JSON.stringify(formData.tags))
      
      if (formData.image instanceof File) {
        form.append('image', formData.image)
      }
      if (formData.video instanceof File) {
        form.append('video', formData.video)
      }
      if (formData.audio instanceof File) {
        form.append('audio', formData.audio)
      }

      const response = await fetch(url, {
        method,
        body: form
      })

      if (!response.ok) throw new Error('Erreur lors de l\'enregistrement')
      
      await fetchCards()
      setFormData({ title: '', category: '', tags: [], image: '', video: '', audio: '' })
      setEditingCard(null)
      setIsModalOpen(false)
    } catch (error) {
      setError(error.message)
    }
  }

  const addTag = (e) => {
    e.preventDefault()
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleEdit = (card) => {
    setEditingCard(card)
    setFormData(card)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) return
    
    try {
      const response = await fetch(`${ROUTES.ADMIN_CARDS}/${id}`, {
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
              setFormData({ title: '', category: '', tags: [], image: '', video: '', audio: '' })
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
                  <td className="px-6 py-4 truncate max-w-xs">{card.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {card.image && <FiImage className="w-5 h-5 text-blue-500" />}
                      {card.video && <FiVideo className="w-5 h-5 text-green-500" />}
                      {card.audio && <FiMusic className="w-5 h-5 text-purple-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 w-[120px]">
                      <button
                        onClick={() => setPreviewCard(card)}
                        className="p-2 text-green-600 hover:text-green-900 transition-colors"
                        title="Prévisualiser"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(card)}
                        className="p-2 text-blue-600 hover:text-blue-900 transition-colors"
                        title="Modifier"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="p-2 text-red-600 hover:text-red-900 transition-colors"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de formulaire */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative animate-fade-in my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-semibold mb-6">
              {editingCard ? 'Modifier la carte' : 'Ajouter une carte'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="film">Film</option>
                  <option value="serie">Série</option>
                  <option value="acteur">Acteur</option>
                  <option value="realisateur">Réalisateur</option>
                  <option value="musique">Musique de film</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Ajouter un tag"
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Image</label>
                  <div
                    {...getImageProps()}
                    className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <input {...getImageInputProps()} />
                    <FiImage className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {formData.image instanceof File 
                        ? formData.image.name 
                        : 'Glissez une image ou cliquez'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Vidéo</label>
                  <div
                    {...getVideoProps()}
                    className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <input {...getVideoInputProps()} />
                    <FiVideo className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {formData.video instanceof File 
                        ? formData.video.name 
                        : 'Glissez une vidéo ou cliquez'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Audio</label>
                  <div
                    {...getAudioProps()}
                    className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <input {...getAudioInputProps()} />
                    <FiMusic className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {formData.audio instanceof File 
                        ? formData.audio.name 
                        : 'Glissez un audio ou cliquez'}
                    </p>
                  </div>
                </div>
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
                      setFormData({ title: '', category: '', tags: [], image: '', video: '', audio: '' })
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

      {/* Modal de prévisualisation */}
      {previewCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={() => setPreviewCard(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-200"
            >
              <FiX className="w-6 h-6" />
            </button>
            <Card {...previewCard} />
          </div>
        </div>
      )}
    </div>
  )
}