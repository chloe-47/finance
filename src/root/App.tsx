import * as React from 'react';
import FinanceSystem from 'src/finance/FinanceSystem';
import MeasurementsProvider from 'src/measurements/MeasurementsProvider';
import useMeasureElement from 'src/measurements/useMeasureElement';
import 'src/root/styles.css';
import TimeSeriesModule from 'src/time_series/TimeSeriesModule';

export default function App() {
  const { ref, rect } = useMeasureElement();
  const [resolvedSystem, setResolvedSystem] = React.useState<
    FinanceSystem | undefined
  >();
  const screenWidth = rect?.width;
  const screenHeight = rect?.height;
  const unresolvedSystem = React.useMemo(
    () =>
      new FinanceSystem({
        rules: [
          {
            action: [
              'Start job',
              { annualSalary: 200e3, name: 'Arbitrary tech job' },
            ],
            trigger: [['Cash <=', 100e3], 'and', 'unemployed'],
          },
          {
            action: 'Quit all jobs',
            trigger: ['Cash >=', 1e6],
          },
        ],
        subsystems: {
          cash: {
            currentValue: 227e3,
          },
          indexFundBalance: {
            initialBalance: 23698.14,
          },
          jobs: {
            currentJobs: [],
          },
          mortgage: {
            apr: '3.625%',
            currentBalance: 816657.88,
            fixedMonthlyPayment: 4308.77,
            insurancePerYear: 2773.0,
            taxPerSixMonths: 5190.1,
          },
          targetCash: {
            max: [2.5, 'years of expenses'],
            min: [2, 'years of expenses'],
          },
          uncategorizedExpenses: {
            currentMonthlyValue: 6e3,
          },
        },
        timeSpan: {
          currentAge: 27,
          deadAt: 85,
        },
      }),
    [],
  );
  React.useEffect(() => {
    unresolvedSystem.resolve().then((res) => setResolvedSystem(res));
  }, [unresolvedSystem]);

  const configs = resolvedSystem?.getTimeSeriesConfigs();
  const height = (screenHeight ?? 800) / ((configs?.length ?? 0) * 1.2) - 20;
  const width = (screenWidth ?? 1200) * 0.7;
  const viewProps = React.useMemo(
    () => ({
      chartSize: { height, pointRadius: 2, width },
    }),
    [height, width, resolvedSystem],
  );

  if (configs === undefined) {
    return <div>Loading</div>;
  }

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
