import { FaArrowLeft } from 'react-icons/fa';

import { Button } from '@components/common/Buttons/Button';
import { Modal } from '@components/common/Modal';
import { Loader } from '@components/common/Loader';
import { FlexDiv } from '@components/common/FlexDiv';
import { Text } from '@components/common/Text';

import styles from './styles.module.scss';

interface Props {
  cancelSearch: () => void;
  isOpen: boolean;
}

export const OnlineGameSearchModal = ({ cancelSearch, isOpen }: Props) => {
  return (
    <Modal isOpen={isOpen}>
      <FlexDiv alignItems="center" flexDirection="col">
        <FlexDiv className={styles.loaderContainer}>
          <Loader />
        </FlexDiv>
        <Text className={styles.text} fontSize="small">
          Searching for game
        </Text>
        <Button
          handleClick={cancelSearch}
          label={
            <>
              <FaArrowLeft className={styles.buttonIcons} />
              Cancel
            </>
          }
        />
      </FlexDiv>
    </Modal>
  );
};
