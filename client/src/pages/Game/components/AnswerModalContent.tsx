import React from "react";
import { IoClose } from "react-icons/io5";
import { SearchInput } from "../../../components/Inputs/SearchInput";
import { debounce } from "../../../utils/debounce";
import { List } from "../../../components/List";
import { ListItem } from "../../../components/List/ListItem";
import { IconButton } from "../../../components/Buttons/IconButton";
import { searchFlags } from "../../../query-hooks/searchFlags";

import styles from "./styles.module.scss";

interface Props {
  closeModal: () => void;
}

export const AnswerModalContent = ({ closeModal }: Props) => {
  const { data: flags, mutate } = searchFlags();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => mutate(event.target.value),
    500
  );

  return (
    <div className={styles.container}>
      <header className={styles.modalHeader}>
        <SearchInput handleSearch={handleSearch} />
        <IconButton handleClick={closeModal} Icon={IoClose} />
      </header>
      <div className={styles.listContainer}>
        <List>
          {flags?.map((flag) => (
            <ListItem key={flag.iso2} content={flag.name} />
          ))}
        </List>
      </div>
    </div>
  );
};
