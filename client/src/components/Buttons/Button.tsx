import styles from "./styles.module.scss";
import { ReactNode } from "react";

interface Props {
  label: ReactNode;
  size?: string;
  handleClick?: () => void;
}

export const Button = ({ label, size, handleClick }: Props) => {
  return (
    <button
      onClick={handleClick}
      className={`${styles.button} ${size === "xlarge" && styles.xlarge}`}
    >
      {label}
    </button>
  );
};
