const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.get('/cards', cardController.getAllCards);
router.get('/cards/:id', cardController.getCard);
router.post('/cards', cardController.createCard);

module.exports = router;