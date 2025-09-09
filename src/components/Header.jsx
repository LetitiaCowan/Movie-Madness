import React, { useEffect, useRef, useState } from "react";
import Movies from "./Movies";

const Header = ({ movies, setMovies, searchValue, setSearchValue }) => {
  const movieRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (movieRef.current) {
      setIsLoading(true);
      try {
        await movieRef.current.fetchMovies(searchValue);
      } finally {
        setIsLoading(false);
      }
    }
  };


  useEffect(() => {
    console.log(movies);
  }, [movies]);

  const filterMovies = (filter) => {
    if (!filter) return;
    
    const sortedMovies = [...movies];

    switch (filter) {
      case "release_date":
        sortedMovies.sort((a, b) => {
          const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 0;
          const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 0;
          return yearA - yearB;
        });
        break;
      case "rating":
        sortedMovies.sort((a, b) => {
          const ratingA = parseFloat(a.vote_average) || 0;
          const ratingB = parseFloat(b.vote_average) || 0;
          return ratingB - ratingA;
        });
        break;
      case "title":
        sortedMovies.sort((a, b) => {
          const titleA = a.title || a.primaryTitle || "";
          const titleB = b.title || b.primaryTitle || "";
          return titleA.localeCompare(titleB);
        });
        break;
      case "popularity":
        sortedMovies.sort((a, b) => {
          const popularityA = parseFloat(a.popularity) || 0;
          const popularityB = parseFloat(b.popularity) || 0;
          return popularityB - popularityA;
        });
        break;
      default:
        return;
    }

    setMovies(sortedMovies);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Find Your Next Movie Adventure!
        </h1>
        <p className="text-gray-400 mb-8">
          Discover popular movies or search for your favorites
        </p>
        <div className="flex items-center space-x-4 max-w-lg mx-auto">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for movies..."
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`text-white px-5 py-2 rounded-lg ${
              isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              'Search'
            )}
          </button>
          

          <select
            onChange={(event) => filterMovies(event.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 pr-8 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Sort By</option>
            <option value="release_date">Release Date</option>
            <option value="rating">Rating</option>
            <option value="title">Title</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
        {/* Pass movies and setter to Movies */}
        <Movies ref={movieRef} movies={movies} setMovies={setMovies} />
      </div>
    </div>
  );
};

export default Header;
