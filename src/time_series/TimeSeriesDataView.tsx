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
  ready: boolean;
}>;

type ImplProps = Omit<Props, 'definition' | 'xOffset' | 'yOffset' | 'ready'> &
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
  ready,
}: Props): JSX.Element {
  const { chartSize: chartSize_ } = definition;

  const chartSize = getCompleteChartSize(chartSize_);
  if (chartSize === undefined) {
    return <div />;
  }

  const { width, height } = chartSize;

  if (xOffset === undefined || yOffset === undefined || !ready) {
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

type MemoizedValuesFromImplProps = Readonly<{
  border: JSX.Element;
  mappedCoordinates: MappedCoordinates;
  seriesPaths: JSX.Element[];
}>;

function getMemoizedValues({
  definition,
  xOffset,
  yOffset,
  valueRange,
}: ImplProps): MemoizedValuesFromImplProps {
  const { dataViewMinCoordinate: xMin, dataViewMaxCoordinate: xMax } = xOffset;
  const { dataViewMinCoordinate: yMin, dataViewMaxCoordinate: yMax } = yOffset;
  const { chartSize, dateRange, seriesData } = definition;
  const { pointRadius } = chartSize;
  const { getCoordinates, zeroYCoord } = createCoordinateMapper({
    chartSize,
    dateRange,
    valueRange,
    xMax,
    xMin,
    yMax,
    yMin,
  });
  const mappedCoordinates = MappedCoordinates.createMappedCoordinates({
    definition,
    getCoordinates,
    xMax,
    xMin,
    yMax,
    yMin,
  });
  return {
    border: (
      <>
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
      </>
    ),
    mappedCoordinates,
    seriesPaths: seriesData.seriesList.map((series: Series): JSX.Element => {
      const path = createPath(
        series.points.map(getCoordinates),
        pointRadius,
        series.style,
      );
      return <svg key={series.label}>{path}</svg>;
    }),
  };
}

function TimeSeriesDataViewImpl(props: ImplProps): JSX.Element {
  const { dataViewMinCoordinate: xMin, dataViewMaxCoordinate: xMax } =
    props.xOffset;
  const { dataViewMinCoordinate: yMin, dataViewMaxCoordinate: yMax } =
    props.yOffset;
  const { width, height } = props.definition.chartSize;
  const { ref: svgRef, rect: svgRect } = useMeasureElement();
  const [hoverCoordinates, setHoverCoordinates] = React.useState<
    HoverCoordinates | undefined
  >();

  const { border, seriesPaths, mappedCoordinates } = React.useMemo(
    () => getMemoizedValues(props),
    [props.definition, props.xOffset, props.yOffset, props.valueRange],
  );

  const mouseMoveHandler = React.useCallback(
    (e: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
      if (svgRect != null) {
        const { left, top, bottom } = svgRect;
        const { clientX: x, clientY: y } = e;
        if (
          left + xMin <= x &&
          x <= left + xMax &&
          bottom - yMax <= y &&
          y <= bottom - yMin
        ) {
          setHoverCoordinates(
            mappedCoordinates.snap({ x: x - left, y: y - top }),
          );
        } else {
          setHoverCoordinates(undefined);
        }
      }
    },
    [svgRect, props.xOffset, props.yOffset, mappedCoordinates],
  );

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
        onMouseMove={mouseMoveHandler}
        ref={svgRef}
        width={width}
      >
        {border}
        {hoverCoordinates === undefined ? null : (
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
        )}
        {seriesPaths}
      </svg>
    </div>
  );
}

function createPath(
  allCoordinates: Array<Coordinates>,
  pointRadius: number,
  { color, thickness }: SeriesStyle,
): JSX.Element {
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
