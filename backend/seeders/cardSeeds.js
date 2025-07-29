const Card = require('../models/Card');

const cardSeeds = [
  {
    title: "Inception",
    category: "Film",
    tags: ["science-fiction", "action", "rêve"],
    image: "inception.jpg"
  },
  {
    title: "Breaking Bad",
    category: "Série",
    tags: ["drame", "crime", "thriller"],
    image: "breaking-bad.jpg"
  },
  {
    title: "La La Land",
    category: "Film",
    tags: ["musical", "romance", "drame"],
    image: "lalaland.jpg"
  }
];

const seedCards = async () => {
  try {
    // Suppression de toutes les cartes existantes
    await Card.sync({ force: true });
    
    // Création des nouvelles cartes
    await Card.bulkCreate(cardSeeds);
    
    console.log('Base de données réinitialisée et remplie avec succès !');
  } catch (error) {
    console.error('Erreur lors du seeding :', error);
  }
};

module.exports = seedCards;