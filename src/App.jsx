import { useState, useEffect } from "react";
import axios from "axios";
import { CircleDashed } from "lucide-react";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchMetrics } from "./utils/updateSearchMetrics";
import getTrendingMovies from "./utils/updateTrending";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  // TODO:
  /*
  1. implement error boundary for the whole page when both request fails~kinda
  2. show a friendly fallback UI with an option to retry fetching data
  3. add pagination or infinite scroll for movie list
  4. improve accessibility features
  5. write unit and integration tests
  */

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchErrorMessage, setSearchErrorMessage] = useState("");

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [trendingErrorMessage, setTrendingErrorMessage] = useState("");

  //Debounce the search term input to limit API calls by waiting 500ms after user stops typing
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Function to fetch movies from TMDB API
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setSearchErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc  `;

      const response = await axios.get(endpoint, API_OPTIONS);

      //using the short-circuiting to handle cases where response.data.results might be undefined
      setMovieList(response.data.results || []);

      // Call the function to update search count in Appwrite database
      if (query && response.data.results.length > 0) {
        await updateSearchMetrics(query, response.data.results[0]);
      }
    } catch (error) {
      setSearchErrorMessage("Failed to load movies. Please try again later.");
      setMovieList([]);
      console.error(`Error Fetching movies: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load trending movies on initial render
  const loadTrendingMovies = async () => {
    try {
      setIsTrendingLoading(true);
      setTrendingErrorMessage("");
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setTrendingErrorMessage("Failed to load trending movies.");
      setTrendingMovies([]);
    } finally {
      setIsTrendingLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

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

        {/* Trending Movies Section */}
        <section className="my-6">
          <h2>Trending Movies</h2>
          {isTrendingLoading ? (
            <CircleDashed
              className="animate-spin text-blue-400 mt-5"
              size={35}
              strokeWidth={2.4}
            />
          ) : trendingErrorMessage ? (
            <p className="text-red-500 md:text-lg mt-3">
              {trendingErrorMessage}
            </p>
          ) : trendingMovies.length > 0 ? (
            <section className="trending">
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.posterUrl} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p className="text-gray-500 mt-2 text-lg">
              No trending movies available currently.
            </p>
          )}

          {/* All Movies Section */}
        </section>
        <section className="all-movies">
          <h2>All Movies </h2>

          {isLoading ? (
            <CircleDashed
              className="animate-spin text-blue-400"
              size={35}
              strokeWidth={2.4}
            />
          ) : searchErrorMessage ? (
            <p className="text-red-500 md:text-lg">{searchErrorMessage}</p>
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
