import React from 'react';
import type { Coordinates } from '../createCoordinateMapper';
import type { SeriesStyle } from '../SeriesTypes';

type Props = Readonly<{
  allCoordinates: Array<Coordinates>;
  style: SeriesStyle;
}>;

export default function SeriesPath({
  allCoordinates,
  style,
}: Props): JSX.Element {
  const { color, thickness } = style;
  const d = allCoordinates.map(createPathSegmentForCoordinates).join(' ');
  return (
    <path
      d={d}
      fill="none"
      stroke={color === 'pink' ? '#a7a' : '#888'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={thickness === 'thick' ? 1.5 : 0.5}
    />
  );

  function createPathSegmentForCoordinates(
    coords: Coordinates,
    index: number,
  ): string {
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands
    const prefix = index === 0 ? 'M' : 'L';
    const x = coords.cx.toFixed(2);
    const y = coords.cy.toFixed(2);
    return prefix + ' ' + x + ',' + y;
  }
}
