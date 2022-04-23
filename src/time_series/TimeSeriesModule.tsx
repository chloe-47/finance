import * as React from 'react';
import 'src/root/styles.css';
import TimeSeries from 'src/time_series/TimeSeries';
import type { TimeSeriesModel } from './models/TimeSeriesModel';
import type { TimeSeriesChartViewProps } from './SeriesTypes';

type Props = Readonly<{
  model: TimeSeriesModel;
  viewProps: TimeSeriesChartViewProps;
}>;

export default function TimeSeriesModule({
  model,
  viewProps,
}: Props): JSX.Element {
  const [timeSeriesDefinition, setTimeSeriesDefinition] = React.useState(() =>
    model.getInitialState(),
  );
  React.useEffect(() => {
    model.subscribe(setTimeSeriesDefinition);
    return () => model.unsubscribe(setTimeSeriesDefinition);
  }, [model]);
  const timeSeriesDefinitionWithViewProps = React.useMemo(
    () => ({
      ...timeSeriesDefinition,
      ...viewProps,
    }),
    [timeSeriesDefinition, viewProps],
  );
  return <TimeSeries definition={timeSeriesDefinitionWithViewProps} />;
}
