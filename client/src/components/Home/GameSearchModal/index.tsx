import { FaArrowLeft } from 'react-icons/fa';

import { Button } from '@components/common/Buttons/Button';
import { Modal } from '@components/common/Modal';
import { Loader } from '@components/common/Loader';
import { FlexDiv } from '@components/common/FlexDiv';
import { Heading } from '@components/common/Heading';

import styles from './styles.module.scss';

interface Props {
  cancelSearch: () => void;
  isOpen: boolean;
}

export const OnlineGameSearchModal = ({ cancelSearch, isOpen }: Props) => {
  return (
    <Modal isOpen={isOpen}>
      <FlexDiv alignItems="center" flexDirection="col">
        <Heading variant="h3">Searching for game</Heading>
        <FlexDiv className={styles.loaderContainer}>
          <Loader />
        </FlexDiv>
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
