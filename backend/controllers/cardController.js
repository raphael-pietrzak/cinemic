const Card = require('../models/Card');
const multer = require('multer');
const path = require('path');

// Configuration du stockage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = 'uploads/';
    if (file.mimetype.startsWith('image/')) {
      uploadDir += 'images/';
    } else if (file.mimetype.startsWith('video/')) {
      uploadDir += 'videos/';
    } else if (file.mimetype.startsWith('audio/')) {
      uploadDir += 'audio/';
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

// Middleware pour gérer plusieurs types de fichiers
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]);

exports.getCard = async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ message: 'Carte non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createCard = async (req, res) => {
  try {
    const cardData = { ...req.body };
    
    // Gestion des fichiers uploadés
    if (req.files) {
      if (req.files.image) {
        cardData.image = '/uploads/images/' + req.files.image[0].filename;
      }
      if (req.files.video) {
        cardData.video = '/uploads/videos/' + req.files.video[0].filename;
      }
      if (req.files.audio) {
        cardData.audio = '/uploads/audio/' + req.files.audio[0].filename;
      }
    }

    // Conversion des tags en tableau si nécessaire
    if (cardData.tags && typeof cardData.tags === 'string') {
      cardData.tags = cardData.tags.split(',').map(tag => tag.trim());
    }

    const card = await Card.create(cardData);
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
};

exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    const cardData = { ...req.body };
    
    // Gestion des fichiers uploadés
    if (req.files) {
      if (req.files.image) {
        cardData.image = '/uploads/images/' + req.files.image[0].filename;
      }
      if (req.files.video) {
        cardData.video = '/uploads/videos/' + req.files.video[0].filename;
      }
      if (req.files.audio) {
        cardData.audio = '/uploads/audio/' + req.files.audio[0].filename;
      }
    }

    // Conversion des tags en tableau si nécessaire
    if (cardData.tags && typeof cardData.tags === 'string') {
      cardData.tags = cardData.tags.split(',').map(tag => tag.trim());
    }

    await card.update(cardData);
    res.json(card);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de mise à jour', error: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }
    await card.destroy();
    res.json({ message: 'Carte supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de suppression', error: error.message });
  }
};

// Exporter le middleware d'upload pour l'utiliser dans les routes
exports.uploadFields = uploadFields;