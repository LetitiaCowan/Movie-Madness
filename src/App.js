import logo from "./logo.svg";
import "./App.css";
import Nav from "./components/Nav";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieInfo from "./pages/MovieInfo";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App min-h-screen w-full bg-gray-900 text-white">
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Header/>} />
          <Route path="/info" exact element={<MovieInfo />} />
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
