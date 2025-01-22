import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

export const Notification = ({
  active,
  children,
  backgroundColor
}: PropsWithChildren<{ backgroundColor?: string; active?: boolean }>) => {
  return (
    <div
      style={{ backgroundColor }}
      className={`${styles.notification}  ${active ? styles.active : ''}`}
    >
      {children}
    </div>
  );
};
