const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const cardRoutes = require('./routes/cardRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', cardRoutes);

// Synchronisation de la base de données et démarrage du serveur
sequelize.sync()
  .then(() => {
    console.log('Base de données synchronisée');
    app.listen(port, () => {
      console.log(`Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Erreur de synchronisation de la base de données:', err);
  });