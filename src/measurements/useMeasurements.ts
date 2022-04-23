import * as React from 'react';
import type { Measurements, MeasurementSpec } from './ComponentsToMeasureStore';
import subscribeToMeasurements from './subscribeToMeasurements';
import unsubscribeFromMeasurements from './unsubscribeFromMeasurements';

type Args<T> = {
  values: Array<T>;
  render: (val: T) => JSX.Element;
  valToString: (val: T) => string;
};

export default function useMeasurements<T>({
  values,
  render,
  valToString,
}: Args<T>): Measurements<T> | undefined {
  const valuesKey = values.map(valToString).join(':');
  const [measurements, setMeasurements] = React.useState<
    Measurements<T> | undefined
  >();

  React.useEffect(() => {
    const spec =
      createMeasurementSpec() as MeasurementSpec<T> as MeasurementSpec<unknown>;
    subscribeToMeasurements(valuesKey, spec);
    return () => unsubscribeFromMeasurements(valuesKey, spec);

    function createMeasurementSpec(): MeasurementSpec<T> {
      return {
        onMeasure,
        render,
        valToString,
        values,
      };
    }
  }, [valuesKey]);

  const timeout = React.useRef<number | undefined>();
  function onMeasure(measurements: Measurements<T> | undefined): void {
    if (measurements === undefined) {
      setMeasurements(undefined);
    } else {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setMeasurements(measurements);
      }) as unknown as number;
    }
  }

  return measurements;
}
