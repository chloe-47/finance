import * as React from 'react';
import type { Offset } from 'src/measurements/LabelArray';
import useMeasureElementAsRef from 'src/measurements/useMeasureElementAsRef';
import type { TimeSeriesChartDefinitionWithViewProps } from 'src/time_series/SeriesTypes';
import type { ValueRange } from '../getValueRange';
import type { HoverCoordinates } from '../utils/HoverCoordinatesType';
import type { HoverStatus } from './getTimeSeriesDataViewValuesThatDontChangeWithMouseMovement';
import getTimeSeriesDataViewValuesThatDontChangeWithMouseMovement from './getTimeSeriesDataViewValuesThatDontChangeWithMouseMovement';

type Props = Readonly<{
  valueRange: ValueRange;
  definition: TimeSeriesChartDefinitionWithViewProps;
  xOffset: Offset;
  yOffset: Offset;
}>;

export default function TimeSeriesDataView(props: Props): JSX.Element {
  const { width, height } = props.definition.chartSize;
  const { componentRef: svgRef, rectRef: svgRectRef } =
    useMeasureElementAsRef();
  const hoverStatusRef = React.useRef<HoverStatus>({
    hoverBox: false,
    svg: false,
  });
  const [hoverCoordinates, setHoverCoordinates] = React.useState<
    HoverCoordinates | undefined
  >();

  const { SvgWrapper, border, seriesPaths, renderHoverCoordinatesLines } =
    React.useMemo(
      () =>
        getTimeSeriesDataViewValuesThatDontChangeWithMouseMovement({
          ...props,
          hoverStatusRef,
          setHoverCoordinates,
          svgRectRef,
          svgRef,
        }),
      [props.definition, props.xOffset, props.yOffset, props.valueRange],
    );

  return (
    <div
      style={{
        height,
        width,
      }}
    >
      <SvgWrapper>
        {border}
        {renderHoverCoordinatesLines(hoverCoordinates)}
        {seriesPaths}
      </SvgWrapper>
    </div>
  );
}
