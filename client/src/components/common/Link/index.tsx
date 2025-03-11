import { PropsWithChildren } from 'react';
import { Link as RRLink } from 'react-router-dom';

import styles from './styles.module.scss';

interface Props {
  to: string;
  className?: string;
}

export const Link = ({ to, children, className }: PropsWithChildren<Props>) => {
  return (
    <RRLink to={to} className={`${styles.link} ${className}`}>
      {children}
    </RRLink>
  );
};
