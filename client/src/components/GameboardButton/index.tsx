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

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`${styles.button} ${answeredButtonStyle(
        selectedFlag
      )} ${currentPlayerStyle(selectedFlag)}`}
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

function answeredButtonStyle(selectedFlag: SelectedFlag | null) {
  if (selectedFlag) {
    if (selectedFlag?.isCorrect) return styles.flagSelected;
    return styles.flagFalse;
  }
  return "";
}

function currentPlayerStyle(selectedFlag: SelectedFlag | null) {
  if (selectedFlag?.playersMove === 1) return styles.playerOne;
  if (selectedFlag?.playersMove === 2) return styles.playerTwo;
  return "";
}
