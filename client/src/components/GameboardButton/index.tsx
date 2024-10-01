import flags from "country-flag-icons/react/3x2";

import styles from "./styles.module.scss";

interface Props {
  handleClick: () => void;
  selectedFlag: SelectedFlag | null;
  disabled: boolean;
}

export const GameboardButton = ({
  handleClick,
  selectedFlag,
  disabled,
}: Props) => {
  const Flag = flags?.[selectedFlag?.iso_2 as keyof typeof flags];
  const currentPlayerStyle =
    selectedFlag?.playersMove === 1 ? styles.playerOne : styles.playerTwo;

  const isAnsweredFlagCorrect = selectedFlag
    ? selectedFlag.isCorrect
      ? styles.flagSelected
      : styles.flagFalse
    : "";

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`${styles.button} ${isAnsweredFlagCorrect} ${currentPlayerStyle}`}
    >
      {selectedFlag && (
        <>
          <p className={styles.text}>{selectedFlag?.name}</p>
          <Flag className={styles.flag} />
        </>
      )}
    </button>
  );
};
