import React from 'react';

type Props = {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
};

export default function OuterBorder({
  xMin,
  xMax,
  yMin,
  yMax,
}: Props): JSX.Element {
  return (
    <path
      d={`M ${xMin},${yMin} L ${xMin},${yMax} L ${xMax},${yMax} L ${xMax},${yMin} Z`}
      fill="none"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  );
}
