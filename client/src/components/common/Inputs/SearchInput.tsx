import styles from "./searchInput.module.scss";

interface Props {
  handleSearch: () => void;
  autoFocus: boolean;
}

export const SearchInput = ({ handleSearch, autoFocus }: Props) => {
  return (
    <input
      autoFocus={autoFocus}
      className={styles.searchInput}
      onChange={handleSearch}
      type="search"
      placeholder="Search for flags.."
    />
  );
};
