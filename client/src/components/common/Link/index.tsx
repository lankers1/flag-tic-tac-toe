import { PropsWithChildren } from 'react';
import { Link as RRLink } from 'react-router-dom';

import styles from './styles.module.scss';

interface Props {
  to: string;
  className?: string;
  handleClick?: () => void;
}

export const Link = ({
  to,
  children,
  className,
  handleClick
}: PropsWithChildren<Props>) => {
  return (
    <RRLink
      to={to}
      onClick={handleClick}
      className={`${styles.link} ${className}`}
    >
      {children}
    </RRLink>
  );
};
