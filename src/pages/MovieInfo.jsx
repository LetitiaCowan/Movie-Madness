import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MovieInfo = () => {
  const location = useLocation();
  const { movieId, isTmdbId } = location.state || {};
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Transform TMDb API data to match our expected format
  const transformTMDbData = (movieData, creditsData, movieId) => {
    return {
      id: movieId,
      primaryTitle: movieData.title || movieData.original_title || "Unknown Title",
      primaryImage: movieData.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` 
        : movieData.backdrop_path 
        ? `https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`
        : "",
      startYear: movieData.release_date ? new Date(movieData.release_date).getFullYear().toString() : "Unknown Year",
      averageRating: movieData.vote_average ? movieData.vote_average.toFixed(1) : "N/A",
      runtime: movieData.runtime ? `${movieData.runtime} min` : "Unknown",
      description: movieData.overview || "No description available",
      genres: movieData.genres ? movieData.genres.map(genre => genre.name) : [],
      releaseDate: movieData.release_date || "Unknown",
      directors: creditsData && creditsData.crew 
        ? creditsData.crew.filter(person => person.job === 'Director').map(person => person.name)
        : [],
      cast: creditsData && creditsData.cast 
        ? creditsData.cast.slice(0, 10).map(person => person.name)
        : []
    };
  };

  // Transform OMDb API data to match our expected format
  const transformOMDbData = (data, movieId) => {
    return {
      id: movieId,
      primaryTitle: data.Title || "Unknown Title",
      primaryImage: data.Poster || "",
      startYear: data.Year || "Unknown Year",
      averageRating: data.imdbRating || "N/A",
      runtime: data.Runtime || "Unknown",
      description: data.Plot || "No description available",
      genres: data.Genre ? data.Genre.split(', ') : [],
      releaseDate: data.Released || "Unknown",
      directors: data.Director ? data.Director.split(', ') : [],
      cast: data.Actors ? data.Actors.split(', ') : []
    };
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      // Try multiple APIs in order of reliability
      const apis = [
        // Try TMDb first (most reliable)
        async () => {
          const apiKey = '4e44d9029b1270a757cddc766a1bcb63';
          
          // If it's an IMDB ID, find the TMDb ID first
          let tmdbId = movieId;
          if (movieId.startsWith('tt') || !isTmdbId) {
            const findResponse = await axios.get(
              `https://api.themoviedb.org/3/find/${movieId}?api_key=${apiKey}&external_source=imdb_id`
            );
            if (findResponse.data.movie_results && findResponse.data.movie_results.length > 0) {
              tmdbId = findResponse.data.movie_results[0].id;
            } else {
              throw new Error("No TMDb ID found for IMDB ID");
            }
          }
          
          try {
            const [movieResponse, creditsResponse] = await Promise.all([
              axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US`),
              axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${apiKey}&language=en-US`)
            ]);
            
            return transformTMDbData(movieResponse.data, creditsResponse.data, movieId);
          } catch (error) {
            console.error("TMDb API error:", error);
            throw error;
          }
        },
        
        // Try OMDB as fallback
        async () => {
          const response = await axios.get(`https://www.omdbapi.com/?i=${movieId}&apikey=trilogy`);
          if (response.data.Response === 'True') {
            return transformOMDbData(response.data, movieId);
          } else {
            throw new Error("OMDB API returned false");
          }
        },
        
        // Try OMDB with different key
        async () => {
          const response = await axios.get(`https://www.omdbapi.com/?i=${movieId}&apikey=thewdb`);
          if (response.data.Response === 'True') {
            return transformOMDbData(response.data, movieId);
          } else {
            throw new Error("OMDB API with different key failed");
          }
        },
        
        // Try to get basic movie info from search results as fallback
        async () => {
          const apiKey = '4e44d9029b1270a757cddc766a1bcb63';
          
          // Try to get basic movie info using the movie ID
          const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`);
          
          if (response.data) {
            return transformTMDbData(response.data, null, movieId);
          } else {
            throw new Error("No basic movie info available");
          }
        },
        
        // Try a free movie API as last resort
        async () => {
          const response = await axios.get(`https://api.sampleapis.com/movies/action`);
          if (response.data && response.data.length > 0) {
            // Use the first movie as an example
            const movie = response.data[0];
            return {
              id: movieId,
              primaryTitle: movie.title || "Sample Movie",
              primaryImage: movie.posterURL || "",
              startYear: movie.year || "Unknown",
              averageRating: "N/A",
              runtime: "Unknown",
              description: movie.description || "No description available",
              genres: movie.genres || [],
              releaseDate: movie.releaseDate || "Unknown",
              directors: [],
              cast: []
            };
          } else {
            throw new Error("Free API returned no data");
          }
        }
      ];
      
      let success = false;
      for (let i = 0; i < apis.length; i++) {
        try {
          const result = await apis[i]();
          setMovieDetails(result);
          success = true;
          break;
        } catch (error) {
          console.error(`API ${i + 1} failed:`, error.message);
          continue;
        }
      }
      
      if (!success) {
        setMovieDetails({
          id: movieId,
          primaryTitle: "Movie Details Unavailable",
          primaryImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          startYear: "Unknown",
          averageRating: "N/A",
          runtime: "Unknown",
          description: "Sorry, we couldn't load the details for this movie. The API might be temporarily unavailable. Please try again later.",
          genres: [],
          releaseDate: "Unknown",
          directors: [],
          cast: []
        });
      }
      
      setLoading(false);
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId, isTmdbId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl">Movie details not found</h2>
        <p className="text-gray-400 mt-4">Movie ID: {movieId}</p>
        <p className="text-gray-400 mt-2">Is TMDb ID: {isTmdbId ? 'Yes' : 'No'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 text-white pb-16">
    <div className="w-full bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="md:col-span-1">
            <img
              src={movieDetails.primaryImage}
              alt="Movie poster"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          {/* Movie Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movieDetails.primaryTitle}</h1>
              <div className="flex items-center space-x-4 text-gray-400">
                <span className="flex items-center">
                  ⭐ {movieDetails.averageRating}  
                </span>
                <span>{movieDetails.runtime}</span>
                <span>{movieDetails.startYear}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {movieDetails.genres && movieDetails.genres.length > 0 ? (
                movieDetails.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                  >
                    {typeof genre === 'string' ? genre : genre.name || genre}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                  No genres available
                </span>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed">
              {movieDetails.description}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Movie Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">
            Movie Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div>
                <h3 className="font-medium">Release Date</h3>
                <p className="text-gray-400">{movieDetails.releaseDate}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div>
                <h3 className="font-medium">Runtime</h3>
                <p className="text-gray-400">{movieDetails.runtime}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div>
                <h3 className="font-medium">Director</h3>
                <p className="text-gray-400">
                  {movieDetails.directors && movieDetails.directors.length > 0 
                    ? movieDetails.directors.map((director) => 
                        typeof director === 'string' ? director : director.name || director.fullName || director
                      ).join(', ')
                    : 'Unknown'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Cast & Crew */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">
            Cast & Crew
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {movieDetails.cast && movieDetails.cast.length > 0 ? (
              movieDetails.cast.slice(0, 10).map((actor, i) => {
                const actorName = typeof actor === 'string' ? actor : actor.name || actor.fullName || actor;
                return (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      {actorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-300">{actorName}</span>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-gray-400">Cast information not available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default MovieInfo;