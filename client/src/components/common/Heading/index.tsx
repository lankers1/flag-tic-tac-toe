import { createElement, PropsWithChildren } from "react";

import styles from "./styles.module.scss";

interface Props {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  nowrap?: boolean;
}

export const Heading = ({
  variant,
  children,
  className,
  nowrap,
}: PropsWithChildren<Props>) => {
  return createElement(
    variant,
    {
      className: `${styles[`${variant}Heading`]} ${
        nowrap && styles.nowrap
      } ${className}`,
    },
    children
  );
};
