import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

import styles from './styles.module.scss';
import { useParams } from 'react-router-dom';
import { LocalGame } from '@utils/game/LocalGame';
import { OnlineGame } from '@utils/game/OnlineGame';
import { Notification } from '@components/common/Notification';
import { useGameStore } from '@store/useGameStore';
import { useSearchFlagsQuery } from '@query-hooks/flags/useSearchFlags';
import { debounce } from '@utils/debounce';
import { SearchInput } from '@components/common/Inputs/SearchInput';
import { IconButton } from '@components/common/Buttons/IconButton';
import { List } from '@components/common/List';
import { ListItem } from '@components/common/List/ListItem';

interface Props {
  closeModal: () => void;
  selectedSquareIndex: [number, number];
  answers: Answers;
  game: LocalGame | OnlineGame;
}

export const answerMap = [
  ['r1c1', 'r1c2', 'r1c3'],
  ['r2c1', 'r2c2', 'r2c3'],
  ['r3c1', 'r3c2', 'r3c3']
];

export const AnswerModalContent = ({
  closeModal,
  answers,
  selectedSquareIndex,
  game
}: Props) => {
  const { gameId } = useParams();
  const { currentTurn, selectedFlags } = useGameStore((state) => state);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: flags, error, isError } = useSearchFlagsQuery(searchTerm);

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setSearchTerm(event.target.value),
    500
  );

  const handleSelect = (flag: Flag) => {
    const answerKey =
      answerMap[selectedSquareIndex[0] - 1][selectedSquareIndex[1] - 1];

    const answerArr = answers[answerKey];
    const isCorrectAnswer = answerArr.includes(flag.iso_2);

    game.handleAnswer(
      closeModal,
      gameId,
      currentTurn,
      flag.iso_2,
      flag.name,
      selectedSquareIndex,
      isCorrectAnswer
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.modalHeader}>
        <SearchInput handleSearch={handleSearch} autoFocus />
        <IconButton handleClick={closeModal} Icon={IoClose} />
      </header>
      {isError && (
        <Notification className={styles.errorNotification} type="error">
          {error?.message}
        </Notification>
      )}
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
