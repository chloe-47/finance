import * as React from 'react';
import type { Offset } from 'src/measurements/LabelArray';
import type { Coordinates } from 'src/time_series/createCoordinateMapper';
import createCoordinateMapper from 'src/time_series/createCoordinateMapper';
import {
  getCompleteChartSize,
  Series,
  SeriesStyle,
  TimeSeriesChartDefinitionWithMaybeIncompleteChartSize,
  TimeSeriesChartDefinitionWithViewProps,
} from 'src/time_series/SeriesTypes';
import useMeasureElement from '../measurements/useMeasureElement';
import type { ValueRange } from './getValueRange';
import type { HoverCoordinates } from './utils/HoverCoordinatesType';
import MappedCoordinates from './utils/MappedCoordinates';

type Props = Readonly<{
  definition: TimeSeriesChartDefinitionWithMaybeIncompleteChartSize;
  xOffset: Offset | undefined;
  yOffset: Offset | undefined;
  valueRange: ValueRange;
}>;

type ImplProps = Omit<Props, 'definition' | 'xOffset' | 'yOffset'> &
  Readonly<{
    definition: TimeSeriesChartDefinitionWithViewProps;
    xOffset: Offset;
    yOffset: Offset;
  }>;

export default function TimeSeriesDataView({
  definition,
  xOffset,
  yOffset,
  valueRange,
}: Props): JSX.Element {
  const { chartSize: chartSize_ } = definition;

  const chartSize = getCompleteChartSize(chartSize_);
  if (chartSize === undefined) {
    return <div />;
  }

  const { width, height } = chartSize;

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

  return (
    <TimeSeriesDataViewImpl
      definition={{ ...definition, chartSize }}
      valueRange={valueRange}
      xOffset={xOffset}
      yOffset={yOffset}
    />
  );
}

function TimeSeriesDataViewImpl({
  definition,
  xOffset,
  yOffset,
  valueRange,
}: ImplProps): JSX.Element {
  const { ref: svgRef, rect: svgRect } = useMeasureElement();
  const [hoverCoordinates, setHoverCoordinates] = React.useState<
    HoverCoordinates | undefined
  >();
  const { dataViewMinCoordinate: xMin, dataViewMaxCoordinate: xMax } = xOffset;
  const { dataViewMinCoordinate: yMin, dataViewMaxCoordinate: yMax } = yOffset;
  const { chartSize, dateRange, seriesData } = definition;
  const { width, height, pointRadius } = chartSize;
  const { getCoordinates, zeroYCoord } = React.useMemo(
    () =>
      createCoordinateMapper({
        chartSize,
        dateRange,
        valueRange,
        xMax,
        xMin,
        yMax,
        yMin,
      }),
    [chartSize, dateRange, valueRange, xMax, xMin, yMax, yMin],
  );

  const mappedCoordinates = React.useMemo(
    () =>
      MappedCoordinates.create({
        getCoordinates,
        seriesData,
        xMax,
        xMin,
        yMax,
        yMin,
      }),
    [getCoordinates, seriesData],
  );

  const snappedHoverCoordinates = mappedCoordinates.snap(hoverCoordinates);

  return (
    <div
      style={{
        height,
        width,
      }}
    >
      <svg
        height={height}
        onMouseLeave={(): void => {
          setHoverCoordinates(undefined);
        }}
        onMouseMove={(e: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
          if (svgRect != null) {
            const { left, top, bottom } = svgRect;
            const { clientX: x, clientY: y } = e;
            if (
              left + xMin <= x &&
              x <= left + xMax &&
              bottom - yMax <= y &&
              y <= bottom - yMin
            ) {
              setHoverCoordinates({ x: x - left, y: y - top });
            } else {
              setHoverCoordinates(undefined);
            }
          }
        }}
        ref={svgRef}
        width={width}
      >
        {/* Border */}
        <path
          d={`M ${xMin},${yMin} L ${xMin},${yMax} L ${xMax},${yMax} L ${xMax},${yMin} Z`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
        />
        {zeroYCoord === undefined ? null : (
          <path
            d={`M ${xMin},${zeroYCoord} L ${xMax},${zeroYCoord}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
          />
        )}
        {snappedHoverCoordinates === undefined ? null : (
          <path
            d={
              `M ${xMin},${snappedHoverCoordinates.y} L ${xMax},${snappedHoverCoordinates.y} ` +
              `M ${snappedHoverCoordinates.x},${yMin} L ${snappedHoverCoordinates.x},${yMax}`
            }
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
          />
        )}
        {seriesData.seriesList.map((series: Series): JSX.Element => {
          const path = createPath(
            series.points.map(getCoordinates),
            pointRadius,
            series.style,
          );
          return <svg key={series.label}>{path}</svg>;
        })}
      </svg>
    </div>
  );
}

function createPath(
  allCoordinates: Array<Coordinates>,
  pointRadius: number,
  { color, thickness }: SeriesStyle,
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
      stroke={color === 'pink' ? '#a7a' : '#888'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={thickness === 'thick' ? 1.5 : 0.5}
    />
  );
}
