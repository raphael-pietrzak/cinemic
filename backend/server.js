const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Simulation d'une base de données avec quelques cartes d'exemple
const cards = {
  '1': {
    id: '1',
    title: 'Carte 1',
    image: 'https://placekitten.com/300/200',
    video: null,
    audio: null
  },
  // Ajoutez d'autres cartes selon vos besoins
};

app.get('/api/cards/:id', (req, res) => {
  const card = cards[req.params.id];
  if (card) {
    res.json(card);
  } else {
    res.status(404).json({ message: 'Carte non trouvée' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});