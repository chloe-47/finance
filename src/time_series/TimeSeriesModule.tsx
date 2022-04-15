import * as React from 'react';
import 'src/root/styles.css';
import TimeSeries from 'src/time_series/TimeSeries';
import type { TimeSeriesModel } from './models/TimeSeriesModel';

type Props = {
  model: TimeSeriesModel;
};

export default function TimeSeriesModule({ model }: Props): JSX.Element {
  const [timeSeriesDefinition, setTimeSeriesDefinition] = React.useState(() =>
    model.getInitialState(),
  );
  React.useEffect(() => {
    model.subscribe(setTimeSeriesDefinition);
    return () => model.unsubscribe(setTimeSeriesDefinition);
  }, [model]);
  return <TimeSeries definition={timeSeriesDefinition} />;
}
