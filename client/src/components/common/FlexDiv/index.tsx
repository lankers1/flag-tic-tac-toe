import { PropsWithChildren } from 'react';

type FlexAlignment = 'flexStart' | 'center' | 'flexEnd';

interface Props {
  justifyContent?: FlexAlignment;
  alignItems?: FlexAlignment;
  flexDirection?: 'row' | 'col';
}

export const FlexDiv = ({
  children,
  justifyContent: jc = 'flexStart',
  alignItems: ai = 'flexStart',
  flexDirection: fd = 'row'
}: PropsWithChildren<Props>) => {
  return (
    <div className={`${jc}JustifyContent ${ai}AlignItems ${fd}FlexDirection`}>
      {children}
    </div>
  );
};
