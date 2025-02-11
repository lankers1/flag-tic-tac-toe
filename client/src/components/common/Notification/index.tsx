import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface Props {
  type?: 'error';
  active?: boolean;
  className?: string;
}

export const Notification = ({
  active,
  children,
  className = '',
  type
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={`${styles.notification} ${className} ${type && styles[type]} ${
        active ? styles.active : ''
      }`}
    >
      {children}
    </div>
  );
};
