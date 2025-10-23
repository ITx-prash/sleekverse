const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="/search.svg" alt="Search" />
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
