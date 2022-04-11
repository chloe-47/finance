import * as React from 'react';
import type { Coordinates } from 'src/chart/time_series/createCoordinateMapper';
import createCoordinateMapper from 'src/chart/time_series/createCoordinateMapper';
import type {
  Point,
  Series,
  TimeSeriesChartDefinition,
} from 'src/chart/time_series/SeriesTypes';
import type { Offset } from 'src/measurements/LabelArray';

type Props = {
  definition: TimeSeriesChartDefinition;
  xOffset: Offset | undefined;
};

export default function TimeSeriesDataView({
  definition,
  xOffset,
}: Props): JSX.Element {
  const { chartSize, seriesList } = definition;
  const { width, height, pointRadius } = chartSize;

  if (xOffset == null) {
    return (
      <div
        style={{
          height,
          width,
        }}
      />
    );
  }

  const { min: xMin, max: xMax } = xOffset;
  const { getCoordinates } = createCoordinateMapper({
    chartSize,
    seriesList,
    xMax,
    xMin,
  });

  return (
    <div
      style={{
        height,
        width,
      }}
    >
      <svg height={height} width={width}>
        {/* Border */}
        <path
          d={`M ${xMin},${pointRadius} L ${xMin},${
            height - pointRadius
          } L ${xMax},${height - pointRadius} L ${xMax},${pointRadius} Z`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
        />
        {seriesList.map((series: Series): JSX.Element => {
          const allCoordinates: Array<Coordinates> = [];
          const points = series.points.map((point: Point): JSX.Element => {
            const coordinates = getCoordinates(point);
            allCoordinates.push(coordinates);
            return (
              <circle
                {...coordinates}
                fill="#dad"
                key={point.date.getTime().toString()}
                onMouseEnter={() => {
                  console.log('mouse enter');
                }}
              />
            );
          });
          const path = createPath(allCoordinates, pointRadius);
          return (
            <svg key={series.label}>
              {path}
              {points}
            </svg>
          );
        })}
      </svg>
    </div>
  );
}

function createPath(
  allCoordinates: Array<Coordinates>,
  pointRadius: number,
): JSX.Element {
  const d = allCoordinates
    .map(({ cx, cy }: Coordinates, index: number): string => {
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands
      const prefix = index === 0 ? 'M' : 'L';
      const x = cx.toFixed(2);
      const y = cy.toFixed(2);
      return prefix + ' ' + x + ',' + y;
    })
    .join(' ');
  return (
    <path
      d={d}
      fill="none"
      stroke="#a7a"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={pointRadius * 1.5}
    />
  );
}
