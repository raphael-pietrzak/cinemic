const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// Routes publiques
router.get('/cards', cardController.getAllCards);
router.get('/cards/:id', cardController.getCard);

// Routes d'administration
router.post('/admin/cards', cardController.createCard);
router.put('/admin/cards/:id', cardController.updateCard);
router.delete('/admin/cards/:id', cardController.deleteCard);

module.exports = router;