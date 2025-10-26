import { useState, useEffect } from "react";
import { CircleDashed } from "lucide-react";
import axios from "axios";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./utils/updateSearchCount";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  //Debounce the search term input to limit API calls by waiting 500ms after user stops typing
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Function to fetch movies from TMDB API
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc  `;

      const response = await axios.get(endpoint, API_OPTIONS);

      //using the short-circuiting to handle cases where response.data.results might be undefined
      setMovieList(response.data.results || []);

      // Call the function to update search count in Appwrite database
      if (query && response.data.results.length > 0) {
        await updateSearchCount(query, response.data.results[0]);
      }
    } catch (error) {
      setErrorMessage("Error fetching movies. Please try again later.");
      setMovieList([]);
      console.error(`Error Fetching movies: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>
            Find. Watch.{" "}
            <span className="text-gradient font-bold"> Repeat.</span> Movies
            you'll actually love.
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-10">All Movies </h2>
          {isLoading ? (
            <CircleDashed
              className="animate-spin text-blue-400"
              size={35}
              strokeWidth={2.4}
            />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
