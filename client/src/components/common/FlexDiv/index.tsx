import { PropsWithChildren } from 'react';

import styles from './styles.module.scss';

type FlexAlignment = 'flexStart' | 'center' | 'flexEnd';

interface Props {
  justifyContent?: FlexAlignment;
  alignItems?: FlexAlignment;
  flexDirection?: 'row' | 'col';
  className?: string;
}

export const FlexDiv = ({
  children,
  justifyContent: jc,
  alignItems: ai,
  flexDirection: fd,
  className
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={`${styles.flex} ${jc && styles[`${jc}JustifyContent`]} ${
        ai && styles[`${ai}AlignItems`]
      } ${fd && styles[`${fd}FlexDirection`]} ${className ? className : ''}`}
    >
      {children}
    </div>
  );
};
