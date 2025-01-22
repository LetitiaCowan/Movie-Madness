import React, { useRef, useState } from "react";
import Movies from "./Movies";

const Header = () => {
  const [search, setSearch] = useState("harry potter");
  const movieRef = useRef();

  const handleSearch = () => {
    if (movieRef.current) {
      movieRef.current.fetchMovies(search); // Call fetchMovies with current search value
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">
          Find Your Next Movie Adventure!
        </h1>

        <nav className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4 flex-1 max-w-2xl ml-8">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for movies..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-black w-20 h-8"
                  >
                    Search
                  </button>
                </div>
                <div className="relative">
                  {/* <select className="appearance-none bg-gray-800 border border-gray-700 text-white px-4 py-2 pr-8 rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="">Sort By</option>
                  <option value="release_date">Release Date</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                  <option value="popularity">Popularity</option>
                </select> */}
                </div>
              </div>
            </div>
          </div>
        </nav>
        <Movies ref={movieRef} searchValue={search} />
      </div>
    </div>
  );
};

export default Header;
