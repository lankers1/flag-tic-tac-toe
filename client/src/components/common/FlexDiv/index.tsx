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
  justifyContent: jc = 'flexStart',
  alignItems: ai = 'flexStart',
  flexDirection: fd = 'row',
  className
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={`${className ? className : ''} ${styles.flex} ${
        styles[`${jc}JustifyContent`]
      } ${styles[`${ai}AlignItems`]} ${styles[`${fd}FlexDirection`]} `}
    >
      {children}
    </div>
  );
};
