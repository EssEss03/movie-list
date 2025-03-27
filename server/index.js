const express = require('express');
const cors = require('cors');

const knex = require('knex')(
    require('./knexfile').development
  );

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/movies', async (req, res) => {
    try {
      const movies = await knex('movies').select('*');
      res.json(movies);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  });

  app.post('/movies', async (req, res) => {
    const { title } = req.body;
  
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Movie title is required' });
    }
  
    try {
      const [newMovie] = await knex('movies')
        .insert({ title, watched: false })
        .returning('*'); // Gets the inserted movie
  
      res.status(201).json(newMovie);
    } catch (err) {
      console.error('Error adding movie:', err);
      res.status(500).json({ error: 'Failed to add movie' });
    }
  });

  app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await knex('movies').where({ id }).del().returning('*');
  
      if (!deleted.length) {
        return res.status(404).json({ error: 'Movie not found' });
      }
  
      res.status(200).json({ message: 'Movie deleted', movie: deleted[0] });
    } catch (err) {
      console.error('Error deleting movie:', err);
      res.status(500).json({ error: 'Failed to delete movie' });
    }
  });

  app.patch('/movies/:id', async (req, res) => {
    const { id } = req.params;
    const { watched } = req.body;
  
    try {
      const [updatedMovie] = await knex('movies')
        .where({ id })
        .update({ watched })
        .returning('*');
  
      res.json(updatedMovie);
    } catch (err) {
      console.error('Error updating movie:', err);
      res.status(500).json({ error: 'Failed to update movie' });
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});