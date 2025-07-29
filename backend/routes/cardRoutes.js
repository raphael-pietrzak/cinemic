const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// Routes publiques
router.get('/cards', cardController.getAllCards);
router.get('/cards/:id', cardController.getCard);

// Routes d'administration avec upload de fichiers
router.post('/admin/cards', cardController.uploadFields, cardController.createCard);
router.put('/admin/cards/:id', cardController.uploadFields, cardController.updateCard);
router.delete('/admin/cards/:id', cardController.deleteCard);

module.exports = router;