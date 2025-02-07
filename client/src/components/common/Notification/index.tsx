import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface Props {
  color?: 'error';
  active?: boolean;
}

export const Notification = ({
  active,
  children,
  color
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={`${styles.notification} ${color && styles[color]} ${
        active ? styles.active : ''
      }`}
    >
      {children}
    </div>
  );
};
