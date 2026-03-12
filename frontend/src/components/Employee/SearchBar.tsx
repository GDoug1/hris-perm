

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const SearchBar = ({ search, setSearch }: Props) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search a user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
