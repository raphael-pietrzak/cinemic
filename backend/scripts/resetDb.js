const seedCards = require('../seeders/cardSeeds');

const resetDatabase = async () => {
  try {
    await seedCards();
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la base de données:', error);
    process.exit(1);
  }
};

resetDatabase();