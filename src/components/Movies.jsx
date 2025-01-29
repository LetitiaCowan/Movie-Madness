import React, { forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { Link} from "react-router-dom";

const Movies = forwardRef(({ movies, setMovies }, ref) => {
  async function fetchMovies(s) {
    const options = {
      method: "GET",
      url: "https://imdb236.p.rapidapi.com/imdb/search",
      params: {
        primaryTitle: s,
        genre: null,
        type: "movie",
        sortField: "id",
        sortOrder: "ASC",
      },
      headers: {
        "x-rapidapi-key": "735f7b1270msh6c586cab168a204p194541jsn4a8b43cfab9c",
        "x-rapidapi-host": "imdb236.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setMovies(response.data.results);
    } catch (error) {
      console.error(error);
    }
  }

  useImperativeHandle(ref, () => ({
    fetchMovies,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-[50px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.slice(0, 6).map((movie) => {
          const imdbId = movie.id.replace("title/", "");
          return (
            <Link
              key={movie.id}
              to="/info"
              state={{ movieId: imdbId }}
              className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
            >
              <img
                src={movie.primaryImage || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
                alt={`${movie.primaryTitle} poster`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">
                  {movie.primaryTitle}
                </h3>
                <p className="text-gray-400 text-sm">{movie.startYear}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

export default Movies;