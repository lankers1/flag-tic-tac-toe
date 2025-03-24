import { FaTimes } from 'react-icons/fa';
import { IconButton } from '../Buttons/IconButton';
import { FlexDiv } from '../FlexDiv';
import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface Props {
  removable?: boolean;
  handleRemove?: () => void;
}

export const Chip = ({
  children,
  removable = false,
  handleRemove
}: PropsWithChildren<Props>) => {
  return (
    <FlexDiv alignItems="center" className={styles.chip}>
      {children}
      {removable && (
        <IconButton
          handleClick={(e) => {
            e.stopPropagation();
            if (handleRemove) {
              handleRemove();
            }
          }}
          height="0.6rem"
          width="0.6rem"
          Icon={FaTimes}
        />
      )}
    </FlexDiv>
  );
};
