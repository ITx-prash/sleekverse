const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="../../public/search.svg" alt="search" />
        <input
          type="text"
          value={searchTerm}
          placeholder="What's on your mind today?"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
