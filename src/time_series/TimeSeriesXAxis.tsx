import * as React from 'react';
import type { TimeSeriesChartDefinition } from 'src/time_series/SeriesTypes';
import getAllDateLabels from 'src/dates/getAllDateLabels';
import type { Offset } from 'src/measurements/LabelArray';
import LabelArray from 'src/measurements/LabelArray';

type Props = {
  definition: TimeSeriesChartDefinition;
  setOffset: (offset: Offset) => void;
};

export default function TimeSeriesXAxis({
  definition,
  setOffset,
}: Props): JSX.Element {
  const { chartSize, seriesList } = definition;
  const { pointRadius, width } = chartSize;
  const allDateLabels = React.useMemo(() => {
    return getAllDateLabels(seriesList);
  }, []);

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
        labels={allDateLabels}
        pointRadius={pointRadius}
        setOffset={setOffset}
        widthOrHeight={width}
      />
    </td>
  );
}
