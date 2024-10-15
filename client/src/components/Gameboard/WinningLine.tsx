export const WinningLine = ({ gameboardRef, winnerDirection }) => {
  const isDiagonal =
    winnerDirection?.direction === 'diagonal-left' ||
    winnerDirection?.direction === 'diagonal-right';
  const height =
    winnerDirection?.direction === 'col'
      ? '280px'
      : isDiagonal
      ? '330px'
      : '8px';
  const leftOffset = winnerDirection?.direction === 'col' ? 125 : 120;
  const topOffset = isDiagonal ? 20 : 50;
  const rowTopOffset = winnerDirection?.direction === 'row' ? 123 : 120;

  return (
    <div
      style={{
        position: 'absolute',
        height: winnerDirection ? height : '0px',
        borderRadius: '12px',
        border: '2px black solid',
        width: winnerDirection
          ? winnerDirection?.direction === 'row'
            ? '280px'
            : '8px'
          : '0px',
        transform: isDiagonal
          ? winnerDirection?.direction === 'diagonal-left'
            ? 'rotate(45deg)'
            : 'rotate(135deg)'
          : 'rotate(0deg)',
        transition:
          winnerDirection?.direction === 'row' ? 'width 1s' : 'height 1s',
        left:
          gameboardRef.current.offsetLeft +
          winnerDirection?.from[1] * leftOffset +
          40,
        top:
          gameboardRef.current.offsetTop +
          winnerDirection?.from[0] * rowTopOffset +
          topOffset,
        backgroundColor: 'black',
        zIndex: 1000
      }}
    />
  );
};
