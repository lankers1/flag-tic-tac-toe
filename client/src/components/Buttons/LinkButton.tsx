import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

interface Props {
  to: string;
  label: string;
}

export const LinkButton = ({ to, label }: Props) => {
  return (
    <Link to={to} className={styles.linkButton}>
      {label}
    </Link>
  );
};
