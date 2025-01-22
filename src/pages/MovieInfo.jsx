import React from "react";
import { useLocation } from "react-router-dom";

const MovieInfo = () => {
  const location = useLocation();
  const { movie } = location.state || {};

  return (
    <div>
      <div className="w-full bg-gray-900 text-white pb-16">
        {/* Movie Header Section */}
        <div className="w-full bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Movie Poster */}
              <div className="md:col-span-1">
                <img
                  src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3"
                  alt="Movie poster"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              {/* Movie Info */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {movie.primaryTitle}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-400">
                    <span className="flex items-center">
                      {movie.averageRating}
                    </span>
                    <span>{movie.startYear}</span>
                    <span className="pl-[54px]">Voted by critics: {movie.numVotes}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis incidunt sed rem nihil cum, adipisci blanditiis,
                  laboriosam neque modi impedit repudiandae obcaecati velit
                  assumenda, commodi voluptatem asperiores quibusdam? Dolor,
                  rem?
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Detailed Information */}
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
                    <h3 className="font-medium">Release date</h3>
                    <p className="text-gray-400">{movie.startYear}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  
                </div>
              </div>
            </div>
            {/* Cast & Crew */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">
                Cast & Crew
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Leonardo DiCaprio",
                  "Joseph Gordon-Levitt",
                  "Ellen Page",
                  "Tom Hardy",
                ].map((actor) => (
                  <div key={actor} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      {actor.charAt(0)}
                    </div>
                    <span className="text-gray-300">{actor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
