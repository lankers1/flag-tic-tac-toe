import { capitaliseFirst } from "../../utils/capitaliseFirst";
import { removeSnakeCase } from "../../utils/removeSnakeCase";
import { GameboardButton } from "../GameboardButton";

import styles from "./styles.module.scss";

export const Gameboard = ({ data, handleClick }) => {
  return (
    <div className={styles.boardContainer}>
      <div className={styles.innerContainer}>
        <ColumnLabels data={data} />
        <div className={styles.innerRow}>
          <RowLabels data={data} />
          <div className={styles.boardGrid}>
            {[...Array(9)].map((_, index) => (
              <GameboardButton
                key={"gameboard-button" + index}
                handleClick={handleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ColumnLabels = ({ data }) => (
  <div className={styles.columnLabelContainer}>
    <div className={styles.columnLabel}>
      <p>{capitaliseFirst(removeSnakeCase(data.first_column))}</p>
    </div>
    <div className={styles.columnLabel}>
      <p>{capitaliseFirst(removeSnakeCase(data.second_column))}</p>
    </div>
    <div className={styles.columnLabel}>
      <p>{capitaliseFirst(removeSnakeCase(data.third_column))}</p>
    </div>
  </div>
);

const RowLabels = ({ data }) => (
  <div className={styles.rowLabelContainer}>
    <div className={styles.rowLabel}>
      <p>{capitaliseFirst(removeSnakeCase(data.first_row))}</p>
    </div>
    <div className={styles.rowLabel}>
      <p>{capitaliseFirst(removeSnakeCase(data.second_row))}</p>
    </div>
    <div className={styles.rowLabel}>
      <p>{capitaliseFirst(removeSnakeCase(data.third_row))}</p>
    </div>
  </div>
);
