import * as React from 'react';
import HoverComponentStore from 'src/hover/HoverComponentStore';
import inRect from 'src/measurements/inRect';
import type { Offset } from 'src/measurements/LabelArray';
import type { Rect } from 'src/measurements/useMeasureElementAsRef';
import createCoordinateMapper from 'src/time_series/createCoordinateMapper';
import type {
  Series,
  TimeSeriesChartDefinitionWithViewProps,
} from 'src/time_series/SeriesTypes';
import type { ValueRange } from '../getValueRange';
import type { HoverCoordinates } from '../utils/HoverCoordinatesType';
import MappedCoordinates from '../utils/MappedCoordinates';
import HoverContents from './HoverContents';
import HoverCoordinatesLines from './HoverCoordinatesLines';
import OuterBorder from './OuterBorder';
import SeriesPath from './SeriesPath';
import YAxisLine from './YAxisLine';

export type HoverStatus = {
  hoverBox: boolean;
  svg: boolean;
};

type ReturnValues = Readonly<{
  border: JSX.Element;
  mappedCoordinates: MappedCoordinates;
  seriesPaths: JSX.Element[];
  SvgWrapper: (props: {
    children: (JSX.Element[] | JSX.Element | null | undefined)[];
  }) => JSX.Element;
  renderHoverCoordinatesLines: (
    hoverCoordinates: HoverCoordinates | undefined,
  ) => JSX.Element | null;
}>;

type Props = Readonly<{
  valueRange: ValueRange;
  definition: TimeSeriesChartDefinitionWithViewProps;
  xOffset: Offset;
  yOffset: Offset;
  hoverStatusRef: { current: HoverStatus };
  setHoverCoordinates: (hoverCoordinates: HoverCoordinates | undefined) => void;
  svgRef: React.RefCallback<SVGElement>;
  svgRectRef: React.RefObject<Rect | undefined>;
}>;

export default function getTimeSeriesDataViewValuesThatDontChangeWithMouseMovement({
  definition,
  xOffset,
  yOffset,
  valueRange,
  hoverStatusRef,
  setHoverCoordinates,
  svgRef,
  svgRectRef,
}: Props): ReturnValues {
  const { dataViewMinCoordinate: xMin, dataViewMaxCoordinate: xMax } = xOffset;
  const { dataViewMinCoordinate: yMin, dataViewMaxCoordinate: yMax } = yOffset;
  const { chartSize, dateRange, seriesData } = definition;
  const { width, height } = chartSize;
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
  });

  function mouseLeaveHandler(component: keyof HoverStatus): void {
    hoverStatusRef.current[component] = false;
    if (!Object.values(hoverStatusRef.current).some(Boolean)) {
      setHoverCoordinates(undefined);
      HoverComponentStore.update({
        component: undefined,
        coordinates: undefined,
      });
    }
  }

  function mouseMoveHandler(
    e: React.MouseEvent<SVGSVGElement | HTMLDivElement, MouseEvent>,
    component: keyof HoverStatus,
  ): void {
    if (svgRectRef.current == null) {
      return;
    }
    const { left, top } = svgRectRef.current;
    const { clientX: x, clientY: y } = e;
    const relativeCoordinates = mappedCoordinates.snap({
      x: x - left,
      y: y - top,
    });
    const absoluteCoordinates = {
      x: relativeCoordinates.x + left,
      y: relativeCoordinates.y + top,
    };
    hoverStatusRef.current[component] = true;
    setHoverCoordinates(relativeCoordinates);
    HoverComponentStore.update({
      component: (
        <div
          onMouseEnter={(e) => mouseMoveHandler(e, 'hoverBox')}
          onMouseLeave={(e) => {
            mouseLeaveHandler('hoverBox');
            if (!inRect(e, svgRectRef.current, -2)) {
              mouseLeaveHandler('svg');
            }
          }}
          onMouseMove={(e) => mouseMoveHandler(e, 'hoverBox')}
          style={{
            backgroundColor: '#ccc',
            borderRadius: 5,
            padding: 5,
            pointerEvents: 'all',
          }}
        >
          <HoverContents label={definition.label} />
        </div>
      ),
      coordinates: absoluteCoordinates,
    });
  }
  function SvgWrapper({
    children,
  }: {
    children: (JSX.Element[] | JSX.Element | null | undefined)[];
  }): JSX.Element {
    return (
      <svg
        height={height}
        onMouseEnter={(e) => mouseMoveHandler(e, 'svg')}
        onMouseLeave={(e): void => {
          if (!inRect(e, svgRectRef.current, -2)) {
            mouseLeaveHandler('svg');
          }
        }}
        onMouseMove={(e) => mouseMoveHandler(e, 'svg')}
        ref={svgRef}
        width={width}
      >
        {children}
      </svg>
    );
  }

  function renderHoverCoordinatesLines(
    hoverCoordinates: HoverCoordinates | undefined,
  ): JSX.Element | null {
    return (
      <HoverCoordinatesLines
        hoverCoordinates={hoverCoordinates}
        xMax={xMax}
        xMin={xMin}
        yMax={yMax}
        yMin={yMin}
      />
    );
  }

  const border = (
    <>
      <OuterBorder xMax={xMax} xMin={xMin} yMax={yMax} yMin={yMin} />
      <YAxisLine xMax={xMax} xMin={xMin} zeroYCoord={zeroYCoord} />
    </>
  );

  const seriesPaths = seriesData.seriesList.map(
    (series: Series): JSX.Element => {
      return (
        <SeriesPath
          allCoordinates={series.points.map(getCoordinates)}
          key={series.label}
          style={series.style}
        />
      );
    },
  );

  return {
    SvgWrapper,
    border,
    mappedCoordinates,
    renderHoverCoordinatesLines,
    seriesPaths,
  };
}
