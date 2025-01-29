import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MovieInfo = () => {
  const location = useLocation();
  const { movieId } = location.state || {};
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const options = {
        method: "GET",
        url: `https://imdb236.p.rapidapi.com/imdb/${movieId}`, // movieId should now be in the correct format (e.g., tt7631058)
        headers: {
          "x-rapidapi-key": "735f7b1270msh6c586cab168a204p194541jsn4a8b43cfab9c",
          "x-rapidapi-host": "imdb236.p.rapidapi.com",
        },
      };

      try {
        console.log("Fetching details for ID:", movieId); // Debug log
        const response = await axios.request(options);
        console.log("API Response:", response.data); // Debug log
        setMovieDetails(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

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
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 text-white pb-16">
    <div className="w-full bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="md:col-span-1">b
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
                  {movieDetails.averageRating}  
                </span>
                <span>{movieDetails.runtime}</span>
                <span>{movieDetails.startYear}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {movieDetails.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
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
                <p className="text-gray-400">2h 28min</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div>
                <h3 className="font-medium">Director</h3>
                <p className="text-gray-400">{movieDetails.directors.map((director) => director.fullName).join(', ')}</p>
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
            {movieDetails.cast.slice(0, 10).map((actor, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  {actor.fullName.charAt(0)}
                </div>
                <span className="text-gray-300">{actor.fullName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default MovieInfo;