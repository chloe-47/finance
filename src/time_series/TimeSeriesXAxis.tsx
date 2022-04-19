import * as React from 'react';
import type { Offset } from 'src/measurements/LabelArray';
import LabelArray from 'src/measurements/LabelArray';
import type { TimeSeriesChartDefinition } from 'src/time_series/SeriesTypes';

type Props = {
  definition: TimeSeriesChartDefinition;
  setOffset: (offset: Offset) => void;
};

export default function TimeSeriesXAxis({
  definition,
  setOffset,
}: Props): JSX.Element {
  const { chartSize } = definition;
  const { pointRadius, width } = chartSize;

  return (
    <td
      style={{
        alignItems: 'flex-end',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <LabelArray
        direction="right"
        labels={definition.dateRange.labels}
        pointRadius={pointRadius}
        setOffset={setOffset}
        widthOrHeight={width}
      />
    </td>
  );
}
