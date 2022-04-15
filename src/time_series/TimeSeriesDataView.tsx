import * as React from 'react';
import type { Offset } from 'src/measurements/LabelArray';
import type { Coordinates } from 'src/time_series/createCoordinateMapper';
import createCoordinateMapper from 'src/time_series/createCoordinateMapper';
import {
  getCompleteChartSize,
  Point,
  Series,
  TimeSeriesChartDefinitionWithMaybeIncompleteChartSize,
} from 'src/time_series/SeriesTypes';
import type { ValueRange } from './getValueRange';

type Props = {
  definition: TimeSeriesChartDefinitionWithMaybeIncompleteChartSize;
  xOffset: Offset | undefined;
  yOffset: Offset | undefined;
  valueRange: ValueRange;
};

export default function TimeSeriesDataView({
  definition,
  xOffset,
  yOffset,
  valueRange,
}: Props): JSX.Element {
  const { chartSize: chartSize_, seriesList } = definition;

  const chartSize = getCompleteChartSize(chartSize_);
  if (chartSize === undefined) {
    return <div />;
  }

  const { width, height, pointRadius } = chartSize;

  if (xOffset === undefined || yOffset === undefined) {
    return (
      <div
        style={{
          height,
          width,
        }}
      />
    );
  }

  const { dataViewMinCoordinate: xMin, dataViewMaxCoordinate: xMax } = xOffset;
  const { dataViewMinCoordinate: yMin, dataViewMaxCoordinate: yMax } = yOffset;
  const { getCoordinates } = createCoordinateMapper({
    chartSize,
    seriesList,
    valueRange,
    xMax,
    xMin,
    yMax,
    yMin,
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
          d={`M ${xMin},${yMin} L ${xMin},${yMax} L ${xMax},${yMax} L ${xMax},${yMin} Z`}
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
            const { cx, cy, r } = coordinates;
            allCoordinates.push(coordinates);
            return (
              <circle
                cx={cx.toFixed(2)}
                cy={cy.toFixed(2)}
                fill="#daf"
                key={point.date.getTime().toString()}
                r={r}
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
