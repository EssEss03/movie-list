import { useEffect, useState } from 'react';
import { Container, Typography,  TextField, Button, List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import './App.css'

function App() {
       const [movies, setMovies] = useState([]);
       const [searchTerm, setSearchTerm] = useState('');
       const [newMovieTitle, setNewMovieTitle] = useState('');
       const [filteredMovies, setFilteredMovies] = useState([]);
       const [selectedMovieId, setSelectedMovieId] = useState(null);
       const [snackbar, setSnackbar] = useState({ open: false, message: '' });
        
       useEffect(() => {
              fetch('http://localhost:3001/movies')
                .then(res => res.json())
                .then(data => {
                  setMovies(data);
                  setFilteredMovies(data);
                })
                .catch(err => console.error('Error fetching movies:', err));
            }, []);
          
            const handleAddMovie = () => {
              const title = newMovieTitle.trim();
              if (!title) return;
          
              fetch('http://localhost:3001/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
              })
                .then(res => res.json())
                .then(newMovie => {
                  const updated = [...movies, newMovie];
                  setMovies(updated);
                  setFilteredMovies(updated);
                  setNewMovieTitle('');
                  setSnackbar({ open: true, message: 'Movie added!' });
                })
                .catch(err => console.error('Error adding movie:', err));
            };
          
            const handleDeleteMovie = (id) => {
              fetch(`http://localhost:3001/movies/${id}`, { method: 'DELETE' })
                .then(() => {
                  const updated = movies.filter(movie => movie.id !== id);
                  setMovies(updated);
                  setFilteredMovies(updated);
                  setSnackbar({ open: true, message: 'Movie deleted.' });
                })
                .catch(err => console.error('Error deleting movie:', err));
            };
          
            const handleToggleWatched = (id, newWatchedStatus) => {
              fetch(`http://localhost:3001/movies/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ watched: newWatchedStatus }),
              })
                .then(res => res.json())
                .then(updatedMovie => {
                  const updated = movies.map(movie =>
                    movie.id === updatedMovie.id ? updatedMovie : movie
                  );
                  setMovies(updated);
                  setFilteredMovies(updated);
                })
                .catch(err => console.error('Error toggling watched:', err));
            };
          
            const handleSelectMovie = (id) => {
              setSelectedMovieId(id === selectedMovieId ? null : id);
            };
          
            return (
              <div className="theater-background">
                <Container maxWidth="sm" sx={{ pt: 6 }}>
                  <Paper elevation={6} sx={{ p: 4, border: '2px solid #b71c1c', borderRadius: 4 }}>
                    <Typography variant="h4" align="center" color="secondary" gutterBottom>
                      🎬 Movie List
                    </Typography>
          
                    {/* 🔍 Search */}
                    <Box
                      component="form"
                      onSubmit={e => e.preventDefault()}
                      sx={{ display: 'flex', gap: 2, mb: 3 }}
                    >
                      <TextField
                        fullWidth
                        label="Search movies..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        sx={{
                          "& .MuiInputLabel-root": { color: "#f0f0f0" },
                          "& .MuiInputBase-input": { color: "#fff" }
                        }}
                      />
                    </Box>
          
                    {/* ➕ Add Movie */}
                    <Box
                      component="form"
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddMovie();
                      }}
                      sx={{ display: 'flex', gap: 2, mb: 3 }}
                    >
                      <TextField
                        fullWidth
                        label="Add a movie..."
                        value={newMovieTitle}
                        onChange={e => setNewMovieTitle(e.target.value)}
                        sx={{
                          "& .MuiInputLabel-root": { color: "#f0f0f0" },
                          "& .MuiInputBase-input": { color: "#fff" }
                        }}
                      />
                      <Button type="submit" variant="contained" color="secondary">
                        Add
                      </Button>
                    </Box>
          
                    {/* 🎛️ Filter Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setFilteredMovies(movies.filter(m => m.watched))}
                      >
                        Watched
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setFilteredMovies(movies.filter(m => !m.watched))}
                      >
                        To Watch
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setFilteredMovies(movies)}
                      >
                        All
                      </Button>
                    </Box>
          
                    {/* 🎞️ Movie List */}
                    {filteredMovies.length === 0 ? (
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{ mt: 2, color: '#ffd700', fontStyle: 'italic' }}
                      >
                        No movies found matching your search.
                      </Typography>
                    ) : (
                      <List>
                        {filteredMovies.map(movie => (
                          <ListItem
                            key={movie.id}
                            secondaryAction={
                              <Box>
                                <Button
                                  size="small"
                                  onClick={() => handleToggleWatched(movie.id, !movie.watched)}
                                  sx={{ color: '#ffd700' }}
                                >
                                  {movie.watched ? 'Unwatch' : 'Watched'}
                                </Button>
                                {movie.id > 5 && (
                                  <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleDeleteMovie(movie.id)}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </Box>
                            }
                            sx={{
                              borderBottom: '1px solid #333',
                              '&:hover': { backgroundColor: '#2c2c2c' }
                            }}
                          >
                            <ListItemText
                              primary={
                                <span
                                  onClick={() => handleSelectMovie(movie.id)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {movie.title}
                                </span>
                              }
                              secondary={movie.watched ? '✅ Watched' : ''}
                              slotProps={{
                                primary: { style: { color: '#ffffff' } },
                                secondary: { style: { color: '#ffd700' } }
                              }}
                            />
                            {/* 👇 Conditionally show movie info */}
                            {selectedMovieId === movie.id && (
                              <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #ffd700' }}>
                                <Typography variant="body2" color="secondary">
                                  Description: A mysterious movie...
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#ccc' }}>
                                  Year: 2023 • Genre: Sci-Fi • Rating: PG-13
                                </Typography>
                              </Box>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Paper>
                </Container>
          
                {/* ✅ Snackbar Notification */}
                <Snackbar
                  open={snackbar.open}
                  autoHideDuration={3000}
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  message={snackbar.message}
                />
              </div>
            );
          }
          
          export default App;