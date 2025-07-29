const Card = require('../models/Card');

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
    const card = await Card.create(req.body);
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
    await card.update(req.body);
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