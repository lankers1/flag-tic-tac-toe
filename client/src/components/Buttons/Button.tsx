import styles from './styles.module.scss';
import { ReactNode } from 'react';

type Color = 'blue' | 'green' | 'default';
interface Props {
  label: ReactNode;
  size?: string;
  type?: 'reset' | 'button' | 'submit' | undefined;
  handleClick?: () => void;
  color?: Color;
}

function determineColor(color: Color) {
  switch (color) {
    case 'blue':
      return styles.blue;
    case 'green':
      return styles.green;
    default:
      return '';
  }
}

export const Button = ({
  label,
  size,
  handleClick,
  type = 'button',
  color = 'default'
}: Props) => {
  return (
    <button
      onClick={handleClick}
      className={`${styles.button} ${
        size === 'xlarge' && styles.xlarge
      } ${determineColor(color)}`}
      type={type}
    >
      {label}
    </button>
  );
};
