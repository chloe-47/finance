import * as React from 'react';
import TimeSeriesDataView from 'src/chart/time_series//TimeSeriesDataView';
import TimeSeriesXAxis from 'src/chart/time_series//TimeSeriesXAxis';
import type { TimeSeriesChartDefinition } from 'src/chart/time_series/SeriesTypes';
import 'src/chart/time_series/TimeSeriesStyles.css';
import type { Offset } from 'src/measurements/LabelArray';

type Props = {
  definition: TimeSeriesChartDefinition;
};

export default function TimeSeries({ definition }: Props): JSX.Element {
  const [xOffset, setXOffset] = React.useState<Offset | undefined>();

  return (
    <table className="TimeSeries">
      <tbody>
        <tr>
          <Cell />
          <Cell>
            <TimeSeriesDataView definition={definition} xOffset={xOffset} />
          </Cell>
        </tr>
        <tr>
          <Cell></Cell>
          <TimeSeriesXAxis definition={definition} setOffset={setXOffset} />
        </tr>
      </tbody>
    </table>
  );

  function Cell({ children }: { children?: React.ReactChild }): JSX.Element {
    return (
      <td
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {children}
      </td>
    );
  }
}
