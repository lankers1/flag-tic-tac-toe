import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface Props {
  fontSize?: 'small' | 'medium' | 'large';
  color?: 'error';
  className?: string;
}

export const Text = ({
  children,
  color,
  fontSize = 'medium',
  className
}: PropsWithChildren<Props>) => {
  const fontSizeClassName = `size-${fontSize}`;
  return (
    <p
      className={`${styles.text} ${className} ${color && styles[color]} ${
        styles[fontSizeClassName]
      }`}
    >
      {children}
    </p>
  );
};
