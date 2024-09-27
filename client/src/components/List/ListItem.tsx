import { ReactElement } from "react";

import styles from "./styles.module.scss";

interface Props {
  content: string | number | ReactElement;
}

export const ListItem = ({ content }: Props) => {
  return <li className={styles.listItem}>{content}</li>;
};
