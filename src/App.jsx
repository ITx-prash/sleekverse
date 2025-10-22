import Search from "./components/Search";
import { useState } from "react";
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <h1>{searchTerm}</h1>
      </div>
    </main>
  );
};

export default App;
