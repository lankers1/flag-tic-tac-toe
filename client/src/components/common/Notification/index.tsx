import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface Props {
  color?: 'error';
  active?: boolean;
  className: string;
}

export const Notification = ({
  active,
  children,
  className = '',
  color
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={`${styles.notification} ${className} ${
        color && styles[color]
      } ${active ? styles.active : ''}`}
    >
      {children}
    </div>
  );
};
