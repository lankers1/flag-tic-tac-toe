import { PropsWithChildren } from "react";

import styles from "./styles.module.scss";

interface Props {
  className?: string;
}

export const Card = ({ children, className }: PropsWithChildren<Props>) => {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
};
