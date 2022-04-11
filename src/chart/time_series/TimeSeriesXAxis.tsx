import * as React from 'react';
import type { TimeSeriesChartDefinition } from 'src/chart/time_series/SeriesTypes';
import getAllDateLabels from 'src/dates/getAllDateLabels';
import type { Offset } from 'src/measurements/LabelArray';
import LabelArray from 'src/measurements/LabelArray';

type Props = {
  definition: TimeSeriesChartDefinition;
  setOffset: (offset: Offset) => void;
};

export default function TimeSeries({
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
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <LabelArray
        labels={allDateLabels}
        pointRadius={pointRadius}
        setOffset={setOffset}
        width={width}
      />
    </td>
  );
}
