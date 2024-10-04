import { Link } from "react-router-dom";

import styles from "./styles.module.scss";
import { ReactNode } from "react";

interface Props {
  to: string;
  label: ReactNode;
  size?: string;
  handleClick?: () => void;
}

export const LinkButton = ({ to, label, size, handleClick }: Props) => {
  return (
    <Link
      onClick={handleClick}
      to={to}
      className={`${styles.linkButton} ${size === "xlarge" && styles.xlarge}`}
    >
      {label}
    </Link>
  );
};
