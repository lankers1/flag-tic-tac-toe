import { useGameStore } from '../../../store/useGameStore';
import { capitaliseFirst } from '../../../utils/capitaliseFirst';
import { removeSnakeCase } from '../../../utils/removeSnakeCase';
import { GameboardButton } from '../GameboardButton';

import styles from './styles.module.scss';
import { useParams } from 'react-router-dom';

interface Props {
  data: Board;
  handleClick: (outerIndex: number, innerIndex: number) => void;
}

export const Gameboard = ({ data, handleClick }: Props) => {
  const { player, gameId } = useParams();
  const { incorrectAnswer, selectedFlags, winner, currentTurn, turn } =
    useGameStore((state) => state);
  const isVersusComputer = !!(player === 'computer' && currentTurn === 2);
  const isOpponentsTurn = currentTurn !== turn && gameId;
  const isGameboardDisabled = !!winner || isVersusComputer || isOpponentsTurn;

  return (
    <div className={styles.boardContainer}>
      <div className={styles.innerContainer}>
        <Labels data={data} labelKey="column" />
        <div className={styles.innerRow}>
          <Labels data={data} labelKey="row" />
          <div className={styles.boardGrid}>
            {[[...Array(3)], [...Array(3)], [...Array(3)]].map(
              (arr, outerIndex) =>
                arr.map((_, innerIndex) => (
                  <GameboardButton
                    ariaLabel={`Row ${outerIndex + 1} Col ${innerIndex + 1}`}
                    cell={{ row: outerIndex, col: innerIndex }}
                    incorrectAnswer={incorrectAnswer}
                    disabled={!!isGameboardDisabled}
                    selectedFlag={selectedFlags[outerIndex][innerIndex]}
                    key={'gameboard-button' + outerIndex + innerIndex}
                    handleClick={() => handleClick(outerIndex, innerIndex)}
                  />
                ))
            )}
          </div>
          <div className={styles.spacer} />
        </div>
      </div>
    </div>
  );
};

interface LabelProps {
  data: Board;
  labelKey: string;
}

const Labels = ({ data, labelKey }: LabelProps) => {
  const labels = [
    data[`first_${labelKey}` as keyof Game],
    data[`second_${labelKey}` as keyof Game],
    data[`third_${labelKey}` as keyof Game]
  ] as string[];

  return (
    <div className={styles[`${labelKey}LabelContainer`]}>
      {labels.map((label) => (
        <div className={styles[`${labelKey}Label`]} key={label}>
          <p>{capitaliseFirst(removeSnakeCase(label))}</p>
        </div>
      ))}
    </div>
  );
};
