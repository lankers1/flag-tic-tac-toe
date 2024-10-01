import React from "react";
import { IoClose } from "react-icons/io5";
import { SearchInput } from "../../../components/Inputs/SearchInput";
import { debounce } from "../../../utils/debounce";
import { List } from "../../../components/List";
import { ListItem } from "../../../components/List/ListItem";
import { IconButton } from "../../../components/Buttons/IconButton";
import { searchFlags } from "../../../query-hooks/searchFlags";

import styles from "./styles.module.scss";
import { useGameStore } from "../../../store/useGameStore";

interface Props {
  closeModal: () => void;
  selectedSquareIndex: number[];
  onSelect: (flags: SelectedFlags) => void;
  selectedFlags: SelectedFlags;
  answers: Answers;
}

const answerMap = [
  ["r1c1", "r1c2", "r1c3"],
  ["r2c1", "r2c2", "r2c3"],
  ["r3c1", "r3c2", "r3c3"],
];

export const AnswerModalContent = ({
  closeModal,
  answers,
  onSelect,
  selectedSquareIndex,
  selectedFlags,
}: Props) => {
  const { togglePlayerTurn, playersTurn } = useGameStore((state) => state);
  const { data: flags, mutate } = searchFlags();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => mutate(event.target.value),
    500
  );

  const handleSelect = (flag: Flag) => {
    const answerKey =
      answerMap[selectedSquareIndex[0] - 1][selectedSquareIndex[1] - 1];

    const answerArr = answers[answerKey];
    selectedFlags[selectedSquareIndex[0] - 1][selectedSquareIndex[1] - 1] = {
      ...flag,
      playersMove: playersTurn,
      isCorrect: answerArr.includes(flag.iso_2),
    };

    onSelect(selectedFlags);
    togglePlayerTurn();
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
