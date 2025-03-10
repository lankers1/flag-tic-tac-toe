import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { useSendAnswer } from '@query-hooks/game/useSendAnswer';
import { useGameStore } from '@store/useGameStore';

export const Clock = ({ size }: { size: number }) => {
  const mutation = useSendAnswer();
  const ticks = useRef();
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );
  const [time, setTime] = useState(0);
  let middle = size / 2;

  const { turn, winner, currentTurn } = useGameStore((state) => state);

  useEffect(() => {
    if (!interval?.current) {
      interval.current = setInterval(update, 1000);
    }
    return () => {
      clearInterval(interval?.current);
      interval.current = undefined;
    };
  }, [interval?.current]);

  useEffect(() => {
    if (!!winner) {
      clearInterval(interval?.current);
      setTime(0);
    }
  }, [interval?.current]);

  useEffect(() => {
    clearInterval(interval?.current);
    setTime(0);
    interval.current = setInterval(update, 1000);
  }, [currentTurn]);

  useEffect(() => {
    if (!!interval?.current && time >= 30) {
      clearInterval(interval?.current);
      setTime(0);
      if (currentTurn === turn) {
        mutation.mutate({
          player: currentTurn,
          flagIso: '',
          name: '',
          isCorrect: false,
          selectedSquareIndex: [2, 2]
        });
      }
      interval.current = setInterval(update, 1000);
    }
  }, [interval, time, currentTurn, turn]);

  function update() {
    setTime((time) => time + 1);
  }

  return (
    <div>
      <svg className="clock" width={size} height={size}>
        <circle
          className={`${
            currentTurn === 1 ? styles.playerOne : styles.playerTwo
          }`}
          cx={middle}
          cy={middle}
          r={middle - middle / 20}
          stroke="black"
          strokeWidth={3}
        />
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          fill="black"
          font-size="15px"
          font-family="Arial"
          dy=".3em"
        >
          {30 - time}
        </text>
        <g className="ticks" ref={ticks.current}>
          {[...Array(30)].map((_, i) => {
            let midPoint = middle;
            let minuteAngle = Math.PI / 15;
            let x = Math.cos(i * minuteAngle + 1.15);
            let y = Math.sin(i * minuteAngle + 1.15);
            let x1 = midPoint + (midPoint / 1.35) * x;
            let y1 = midPoint + (midPoint / 1.35) * y;
            let x2 = midPoint + (midPoint / 1.15) * x;
            let y2 = midPoint + (midPoint / 1.15) * y;
            return (
              <line
                key={`tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={3}
                stroke={
                  time > i
                    ? currentTurn === 1
                      ? '#b0ddff'
                      : '#C4FFBF'
                    : 'black'
                }
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
