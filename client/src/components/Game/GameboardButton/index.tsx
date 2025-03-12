import { useEffect, useState } from 'react';
import * as flags from 'country-flag-icons/react/3x2';
import { IoCloseSharp } from 'react-icons/io5';

import { IncorrectAnswer } from 'src/type-defs/game';
import styles from './styles.module.scss';
import { SelectedFlag } from 'src/type-defs/flag';

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
  ariaLabel
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
  }, [incorrectAnswer]);

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
      {displayIncorrectAnswer && <IoCloseSharp size="3rem" />}
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
  return '';
}

function currentPlayerStyle(selectedFlag: SelectedFlag | null) {
  if (selectedFlag?.playersTurn === 1) return styles.playerOne;
  if (selectedFlag?.playersTurn === 2) return styles.playerTwo;
  return '';
}
