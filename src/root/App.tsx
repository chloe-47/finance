import * as React from 'react';
import FinanceSystem from 'src/finance/FinanceSystem';
import Job from 'src/finance/Job';
import MeasurementsProvider from 'src/measurements/MeasurementsProvider';
import useMeasureElement from 'src/measurements/useMeasureElement';
import 'src/root/styles.css';
import TimeSeriesModule from 'src/time_series/TimeSeriesModule';

export default function App() {
  const { ref, height: screenHeight, width: screenWidth } = useMeasureElement();
  const system = React.useMemo(
    () =>
      new FinanceSystem({
        initialState: {
          cash: 50e3,
          jobs: [],
          monthlyExpenses: 10e3,
        },
        rules: [
          {
            action: [
              'Start job',
              new Job({ annualSalary: 250e3, name: 'Arbitrary tech job' }),
            ],
            trigger: [['Cash <=', 30e3], 'and', 'unemployed'],
          },
          {
            action: 'Quit all jobs',
            trigger: ['Cash >=', 200e3],
          },
        ],
        yearsAhead: 10,
      }).resolve(),
    [],
  );

  const configs = system.getTimeSeriesConfigs();
  const height = (screenHeight ?? 800) / (configs.length * 2) - 50;
  const width = (screenWidth ?? 1200) * 0.7;
  const viewProps = React.useMemo(
    () => ({
      chartSize: { height, pointRadius: 2, width },
    }),
    [height, width],
  );

  return (
    <div className="fullScreen" ref={ref}>
      <MeasurementsProvider />
      <table className="App">
        <tbody>
          {configs.map(({ model, key }) => (
            <TimeSeriesModule key={key} model={model} viewProps={viewProps} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
