import React from 'react';
import type { HoverCoordinates } from '../utils/HoverCoordinatesType';

type Props = {
  hoverCoordinates: HoverCoordinates | undefined;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
};

export default function HoverCoordinatesLines({
  hoverCoordinates,
  xMin,
  yMin,
  xMax,
  yMax,
}: Props): JSX.Element | null {
  return hoverCoordinates === undefined ? null : (
    <path
      d={
        `M ${xMin},${hoverCoordinates.y} L ${xMax},${hoverCoordinates.y} ` +
        `M ${hoverCoordinates.x},${yMin} L ${hoverCoordinates.x},${yMax}`
      }
      fill="none"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  );
}
