import Search from "./components/Search";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  headers: {
    accept: "application.json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);

  const fetchMovies = async () => {
    try {
      const endpoint = `${API_BASE_URL}discover/movie?sort_by=popularity.desc  `;

      const response = await axios.get(endpoint, API_OPTIONS);

      setMovieList(response.data.results);

      console.log(response.data.results);
      // console.log(movieList);
    } catch (error) {
      setErrorMessage("Error fetching movies. Please try again later.");

      console.error(`Error Fetching movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="../public/hero.png" alt="Hero Banner" />
          <h1>
            Find. Watch.{" "}
            <span className="text-gradient font-bold"> Repeat.</span> Movies
            you'll actually love.
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2>All Movies</h2>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </main>
  );
};

export default App;
