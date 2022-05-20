import React from 'react';

type Props = {
  xMin: number;
  xMax: number;
  zeroYCoord: number | undefined;
};

export default function YAxisLine({
  xMin,
  xMax,
  zeroYCoord,
}: Props): JSX.Element | null {
  return zeroYCoord === undefined ? null : (
    <path
      d={`M ${xMin},${zeroYCoord} L ${xMax},${zeroYCoord}`}
      fill="none"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  );
}
