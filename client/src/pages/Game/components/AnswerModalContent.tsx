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
  selectedSquareIndex: number;
  onSelect: (flags: null[] | Flag[]) => void;
  selectedFlags: null[] | Flag[];
}

const answerMap = {
  "1": "r1c1",
  "2": "r1c2",
  "3": "r1c3",
  "4": "r2c1",
  "5": "r2c2",
  "6": "r2c3",
  "7": "r3c1",
  "8": "r3c2",
  "9": "r3c3",
};

export const AnswerModalContent = ({
  closeModal,
  answers,
  onSelect,
  selectedSquareIndex,
  selectedFlags,
}: Props) => {
  const { data: flags, mutate } = searchFlags();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => mutate(event.target.value),
    500
  );

  const handleSelect = (flag: Flag) => {
    const answerKey = answerMap[selectedSquareIndex.toString()];
    const answerArr = answers[answerKey];
    selectedFlags[selectedSquareIndex - 1] = {
      ...flag,
      isCorrect: answerArr.includes(flag.iso_2),
    };

    onSelect(selectedFlags);
    closeModal();
  };

  return (
    <div className={styles.container}>
      <header className={styles.modalHeader}>
        <SearchInput handleSearch={handleSearch} />
        <IconButton handleClick={closeModal} Icon={IoClose} />
      </header>
      <div className={styles.listContainer}>
        <List>
          {flags?.map((flag) => (
            <ListItem
              key={flag.iso_2}
              handleClick={() => handleSelect(flag)}
              content={flag.name}
            />
          ))}
        </List>
      </div>
    </div>
  );
};
