import { RefObject } from 'react';

function dimensionOffsets(direction: string | undefined) {
  switch (direction) {
    case 'row':
      return {
        height: '8px',
        leftOffset: '2.5rem',
        topOffset: '3.25rem',
        width: '280px',
        transition: 'width 1s',
        transform: 'rotate(0deg)'
      };
    case 'col':
      return {
        height: `calc(7rem * 2 + 0.75rem * 2)`,
        leftOffset: '3.25rem',
        topOffset: '3.5rem',
        width: '8px',
        transition: 'height 1s',
        transform: 'rotate(0deg)'
      };
    case 'diagonal-left':
      return {
        height: `calc(10rem * 2 + 0.75rem * 2)`,
        leftOffset: '3.25rem',
        topOffset: '0.5rem',
        width: '8px',
        transform: 'rotate(45deg)',
        transition: 'height 1s'
      };
    case 'diagonal-right':
      return {
        height: `calc(10rem * 2 + 0.75rem * 2)`,
        leftOffset: '3.25rem',
        topOffset: '0.5rem',
        width: '8px',
        transform: 'rotate(135deg)',
        transition: 'height 1s'
      };
    default:
      return {
        height: '0px',
        leftOffset: '0px',
        topOffset: '0px',
        width: '0px'
      };
  }
}

interface Props {
  gameboardRef: RefObject<HTMLDivElement>;
  winnerDirection: { from: [number, number]; direction: string } | null;
}

export const WinningLine = ({ gameboardRef, winnerDirection }: Props) => {
  const offsetTop = gameboardRef.current?.offsetTop;
  const offsetLeft = gameboardRef.current?.offsetLeft;
  const { height, topOffset, leftOffset, width, transition, transform } =
    dimensionOffsets(winnerDirection?.direction);

  return (
    winnerDirection && (
      <div
        style={{
          height,
          width,
          transition,
          transform,
          borderRadius: '12px',
          border: '2px black solid',
          position: 'absolute',
          left: `calc(${offsetLeft}px + ${
            winnerDirection?.from[1] + 1
          } * ${leftOffset} + ${winnerDirection?.from[1]} * 4.5rem)`,
          top: `calc(${offsetTop}px + ${
            winnerDirection?.from[0] + 1
          } * ${topOffset} + ${winnerDirection?.from[0]} * 4.5rem)`,
          backgroundColor: 'black',
          zIndex: 1000
        }}
      />
    )
  );
};
