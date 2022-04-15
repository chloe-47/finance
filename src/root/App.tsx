import * as React from 'react';
import MeasurementsProvider from 'src/measurements/MeasurementsProvider';
import 'src/root/styles.css';
import Dancing401KBalanceDemoModel from 'src/time_series/models/Dancing401KBalanceDemoModel';
import TimeSeriesModule from 'src/time_series/TimeSeriesModule';

export default function App() {
  const model = React.useMemo(() => Dancing401KBalanceDemoModel(), []);

  return (
    <div>
      <MeasurementsProvider />
      <div className="App">
        <TimeSeriesModule model={model} />
      </div>
    </div>
  );
}
