import { PropsWithChildren } from "react";

import styles from "./styles.module.scss";

export const List = ({ children }: PropsWithChildren<{}>) => {
  return <ul className={styles.list}>{children}</ul>;
};
