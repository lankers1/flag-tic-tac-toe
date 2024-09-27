import styles from "./styles.module.scss";

export const GameboardButton = ({ handleClick }) => {
  return (
    <button onClick={handleClick} className={styles.gameboardButton}></button>
  );
};
