import { ReactElement } from 'react';

import styles from './styles.module.scss';

interface Props {
  content: string | number | ReactElement;
  handleClick?: () => void;
  clickable?: boolean;
  className?: string;
}

export const ListItem = ({
  content,
  handleClick,
  className = '',
  clickable = false
}: Props) => {
  return (
    <li
      className={`${styles.listItem} ${className} ${
        clickable && styles.clickable
      }`}
      onClick={clickable ? handleClick : undefined}
    >
      {content}
    </li>
  );
};
