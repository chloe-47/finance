import * as React from 'react';
import TimeSeries from 'src/chart/time_series/TimeSeries';
import addMonths from 'src/dates/addMonths';
import MeasurementsProvider from 'src/measurements/MeasurementsProvider';
import 'src/root/styles.css';

export default function App() {
  const timeSeriesDefinition = React.useMemo(() => {
    return {
      chartSize: {
        height: 300,
        pointRadius: 4,
        width: 400,
      },
      seriesList: [
        {
          label: '401k balance',
          points: [
            {
              date: new Date(),
              value: 140000,
            },
            {
              date: addMonths(new Date(), 1),
              value: 142000,
            },
            {
              date: addMonths(new Date(), 2),
              value: 144500,
            },
            {
              date: addMonths(new Date(), 3),
              value: 147500,
            },
            {
              date: addMonths(new Date(), 4),
              value: 151000,
            },
            {
              date: addMonths(new Date(), 5),
              value: 155000,
            },
            {
              date: addMonths(new Date(), 6),
              value: 142000,
            },
            {
              date: addMonths(new Date(), 7),
              value: 129000,
            },
            {
              date: addMonths(new Date(), 8),
              value: 119000,
            },
            {
              date: addMonths(new Date(), 9),
              value: 112000,
            },
            {
              date: addMonths(new Date(), 10),
              value: 105000,
            },
            {
              date: addMonths(new Date(), 11),
              value: 105500,
            },
            {
              date: addMonths(new Date(), 12),
              value: 106500,
            },
            {
              date: addMonths(new Date(), 13),
              value: 108000,
            },
            {
              date: addMonths(new Date(), 14),
              value: 109000,
            },
            {
              date: addMonths(new Date(), 15),
              value: 111000,
            },
          ],
        },
      ],
    };
  }, []);

  return (
    <div>
      <MeasurementsProvider />
      <div
        className="App"
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TimeSeries definition={timeSeriesDefinition} />
      </div>
    </div>
  );
}
