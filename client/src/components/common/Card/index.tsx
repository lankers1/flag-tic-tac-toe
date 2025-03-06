import { PropsWithChildren } from 'react';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  backgroundColor?: string;
}

export const Card = ({
  children,
  className,
  backgroundColor
}: PropsWithChildren<Props>) => {
  return (
    <article
      className={`${styles.card} ${className}`}
      style={{ backgroundColor }}
    >
      {children}
    </article>
  );
};
