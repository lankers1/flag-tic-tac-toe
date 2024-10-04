import flags from "country-flag-icons/react/3x2";

import styles from "./styles.module.scss";
import { useEffect, useState } from "react";

interface Props {
  handleClick: () => void;
  selectedFlag: SelectedFlag | null;
  disabled: boolean;
  incorrectAnswer: IncorrectAnswer | null;
  cell: { row: number; col: number };
  ariaLabel: string;
}

export const GameboardButton = ({
  handleClick,
  selectedFlag,
  incorrectAnswer,
  disabled,
  cell,
  ariaLabel,
}: Props) => {
  const Flag = flags?.[selectedFlag?.iso_2 as keyof typeof flags];
  const [displayIncorrectAnswer, setDisplayIncorrectAnswer] = useState(false);

  useEffect(() => {
    if (
      incorrectAnswer?.cell.row === cell.row &&
      incorrectAnswer?.cell.col === cell.col
    ) {
      setDisplayIncorrectAnswer(true);
      setTimeout(() => {
        setDisplayIncorrectAnswer(false);
      }, 1500);
    }
  }, [incorrectAnswer?.cell.row, incorrectAnswer?.cell.col]);

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`${styles.button} ${answeredButtonStyle(
        selectedFlag
      )} ${currentPlayerStyle(selectedFlag)} ${
        displayIncorrectAnswer && styles.incorrectAnswer
      }`}
      aria-label={ariaLabel}
    >
      {displayIncorrectAnswer && <p>Wrong!</p>}
      {selectedFlag && (
        <>
          <p className={styles.text}>{selectedFlag?.name}</p>
          <Flag className={styles.flag} />
        </>
      )}
    </button>
  );
};

function answeredButtonStyle(selectedFlag: SelectedFlag | null) {
  if (selectedFlag) {
    return styles.flagSelected;
  }
  return "";
}

function currentPlayerStyle(selectedFlag: SelectedFlag | null) {
  if (selectedFlag?.playersMove === 1) return styles.playerOne;
  if (selectedFlag?.playersMove === 2) return styles.playerTwo;
  return "";
}
