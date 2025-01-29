import React, { useState } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieInfo from "./pages/MovieInfo";
import Footer from "./components/Footer";

function App() {
  const [movies, setMovies] = useState([]); // Store movie results globally
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="App min-h-screen w-full bg-gray-900 text-white">
      <Router>
        <Nav />
        <Routes>
          {/* Pass movies and setters to Header */}
          <Route
            path="/"
            element={
              <Header
                movies={movies}
                setMovies={setMovies}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
            }
          />
          <Route path="/info" element={<MovieInfo />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
