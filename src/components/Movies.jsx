import React, { forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Movies = forwardRef(({ movies, setMovies }, ref) => {
  const [moviesToShow, setMoviesToShow] = React.useState(8);

  const handleShowMore = () => {
    setMoviesToShow(prev => prev + 4);
  };

  const fetchPopularMovies = React.useCallback(async () => {
    const apiKey = '4e44d9029b1270a757cddc766a1bcb63';
    const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

    try {
      const response = await axios.get(popularUrl);
      const movieResults = response.data.results || [];
      setMovies(movieResults);
      console.log("Popular movies loaded:", movieResults);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      // Fallback to trending movies
      try {
        const trendingUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=en-US`;
        const trendingResponse = await axios.get(trendingUrl);
        const trendingMovies = trendingResponse.data.results || [];
        setMovies(trendingMovies);
        console.log("Trending movies loaded:", trendingMovies);
      } catch (trendingError) {
        console.error("Error fetching trending movies:", trendingError);
        setMovies([]);
      }
    }
  }, [setMovies]);

  // Fetch popular movies by default when component mounts
  React.useEffect(() => {
    if (movies.length === 0) {
      fetchPopularMovies();
    }
  }, [movies.length, fetchPopularMovies]);

  // Reset movies to show when movies change (e.g., new search)
  React.useEffect(() => {
    setMoviesToShow(8);
  }, [movies]);

  async function fetchMovies(s) {
    // Using TMDb API - more reliable and comprehensive
    const apiKey = '4e44d9029b1270a757cddc766a1bcb63'; // Free public API key
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(s)}&language=en-US&page=1&include_adult=false`;

    try {
      const response = await axios.get(searchUrl);
      const movieResults = response.data.results || [];
      setMovies(movieResults);
      console.log("TMDb search results:", movieResults);
    } catch (error) {
      console.error("TMDb search error:", error);
      
      // Fallback to OMDB API
      try {
        const fallbackResponse = await axios.get(`https://www.omdbapi.com/?s=${encodeURIComponent(s)}&apikey=trilogy`);
        if (fallbackResponse.data.Search) {
          const fallbackMovies = fallbackResponse.data.Search.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            release_date: movie.Year,
            poster_path: movie.Poster,
            vote_average: movie.imdbRating,
            overview: movie.Plot
          }));
          setMovies(fallbackMovies);
          console.log("OMDB fallback search results:", fallbackMovies);
        } else {
          setMovies([]);
        }
      } catch (fallbackError) {
        console.error("Fallback search error:", fallbackError);
        setMovies([]);
      }
    }
  }

  useImperativeHandle(ref, () => ({
    fetchMovies,
    fetchPopularMovies,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-[50px]">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {movies.length > 0 ? "Movies" : "No movies found"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies && movies.length > 0 ? (
          movies.slice(0, moviesToShow).map((movie) => {
            // Use TMDb ID directly - the movie details page will handle it
            const movieId = movie.id;
            const posterUrl = movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
            
            return (
              <Link
                key={movie.id}
                to="/info"
                state={{ movieId: movieId, isTmdbId: true }}
                className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year'}
                  </p>
                  {movie.vote_average && (
                    <p className="text-yellow-400 text-sm mt-1">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-gray-400">No movies found</p>
        )}
      </div>
      
      {/* Show More Button */}
      {movies && movies.length > moviesToShow && (
        <div className="text-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            Show More Movies
          </button>
        </div>
      )}
    </div>
  );
});

export default Movies;
