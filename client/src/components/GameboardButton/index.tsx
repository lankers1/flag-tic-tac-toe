import flags from "country-flag-icons/react/3x2";

import styles from "./styles.module.scss";

interface Props {
  handleClick: () => void;
  selectedFlag: Flag | null;
}

export const GameboardButton = ({ handleClick, selectedFlag }: Props) => {
  const Flag = flags?.[selectedFlag?.iso_2 as keyof typeof flags];
  return (
    <button
      onClick={handleClick}
      className={`${styles.button} ${
        selectedFlag
          ? selectedFlag.isCorrect
            ? styles.flagSelected
            : styles.flagFalse
          : ""
      }`}
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
