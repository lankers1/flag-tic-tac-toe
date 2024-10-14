import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { SearchInput } from "../../../../components/Inputs/SearchInput";
import { debounce } from "../../../../utils/debounce";
import { List } from "../../../../components/List";
import { ListItem } from "../../../../components/List/ListItem";
import { IconButton } from "../../../../components/Buttons/IconButton";
import { useSearchFlags } from "../../../../query-hooks/searchFlags";

import styles from "./styles.module.scss";
import { useGameStore } from "../../../../store/useGameStore";

interface Props {
  closeModal: () => void;
  selectedSquareIndex: number[];
  onSelect: (flags: SelectedFlags) => void;
  selectedFlags: SelectedFlags;
  answers: Answers;
  setIncorrectAnswer: (incorrectAnswer: IncorrectAnswer) => void;
}

export const answerMap = [
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
  setIncorrectAnswer,
}: Props) => {
  const { togglePlayerTurn, playersTurn } = useGameStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: flags } = useSearchFlags(searchTerm);

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setSearchTerm(event.target.value),
    500
  );

  const handleSelect = (flag: Flag) => {
    const answerKey =
      answerMap[selectedSquareIndex[0] - 1][selectedSquareIndex[1] - 1];

    const answerArr = answers[answerKey];

    if (!answerArr.includes(flag.iso_2)) {
      if (playersTurn === 1) {
        setIncorrectAnswer({
          ...flag,
          player: playersTurn,
          cell: {
            row: selectedSquareIndex[0] - 1,
            col: selectedSquareIndex[1] - 1,
          },
        });
      }
    } else {
      onSelect(
        selectedFlags.map((outerArr, outerIndex) => {
          return outerArr.map((innerArray, index) => {
            if (
              outerIndex === selectedSquareIndex[0] - 1 &&
              index === selectedSquareIndex[1] - 1
            ) {
              return answerArr.includes(flag.iso_2)
                ? {
                    ...flag,
                    playersMove: playersTurn,
                  }
                : null;
            }
            return innerArray;
          });
        })
      );
    }
    togglePlayerTurn();
    closeModal();
  };

  return (
    <div className={styles.container}>
      <header className={styles.modalHeader}>
        <SearchInput handleSearch={handleSearch} autoFocus />
        <IconButton handleClick={closeModal} Icon={IoClose} />
      </header>
      <div className={styles.listContainer}>
        <List>
          {flags
            ?.filter(
              (flag) =>
                !selectedFlags
                  .flat()
                  .map((f) => f?.iso_2)
                  .includes(flag.iso_2)
            )
            .map((flag) => (
              <ListItem
                clickable
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
