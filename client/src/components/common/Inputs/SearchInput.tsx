import { FlexDiv } from '../FlexDiv';
import { Text } from '../Text';
import styles from './inputs.module.scss';

interface Props {
  handleSearch: () => void;
  autoFocus: boolean;
}

export const SearchInput = ({ handleSearch, autoFocus }: Props) => {
  return (
    <FlexDiv className={styles.container}>
      <input
        autoFocus={autoFocus}
        className={styles.input}
        onChange={handleSearch}
        type="search"
      />
      <fieldset className={styles.fieldset}>
        <legend>
          <Text fontSize="small">Search for flags..</Text>
        </legend>
      </fieldset>
    </FlexDiv>
  );
};
