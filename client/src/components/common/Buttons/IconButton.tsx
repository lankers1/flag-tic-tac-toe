import { IconType } from 'react-icons';

import styles from './styles.module.scss';

interface Props {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  height?: string;
  width?: string;
  Icon: IconType;
  disabled?: boolean;
}

export const IconButton = ({
  handleClick,
  height = '1.25rem',
  width = '1.25rem',
  Icon,
  disabled
}: Props) => (
  <button
    onClick={handleClick}
    disabled={disabled}
    className={styles.iconButton}
  >
    <Icon
      className={styles.icon}
      style={{
        height,
        width
      }}
    />
  </button>
);
