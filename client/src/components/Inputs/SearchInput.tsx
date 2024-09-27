import styles from "./searchInput.module.scss";

export const SearchInput = ({ handleSearch }) => {
  return (
    <input
      className={styles.searchInput}
      onChange={handleSearch}
      type="search"
      placeholder="Search for flags.."
    />
  );
};
