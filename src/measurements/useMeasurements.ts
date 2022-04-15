import * as React from 'react';
import type { Measurements, MeasurementSpec } from './ComponentsToMeasureStore';
import ComponentsToMeasureStore from './ComponentsToMeasureStore';

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
  const [measurements, setMeasurements] = React.useState<
    Measurements<T> | undefined
  >();

  React.useEffect(() => {
    const componentsToMeasure = ComponentsToMeasureStore.getValue();
    if (!componentsToMeasure.has(values)) {
      setMeasurements(undefined);
      componentsToMeasure.set(
        values,
        createMeasurementSpec() as MeasurementSpec<T> as MeasurementSpec<unknown>,
      );
      ComponentsToMeasureStore.update(new Map(componentsToMeasure.entries()));
    }
    return () => {
      const componentsToMeasure = ComponentsToMeasureStore.getValue();
      if (componentsToMeasure.has(values)) {
        componentsToMeasure.delete(values);
        ComponentsToMeasureStore.update(new Map(componentsToMeasure.entries()));
      }
    };

    function createMeasurementSpec(): MeasurementSpec<T> {
      return {
        onMeasure,
        render,
        valToString,
        values,
      };
    }
  }, [values.map(valToString).join(':')]);

  const timeout = React.useRef<number | undefined>();
  function onMeasure(measurements: Measurements<T>): void {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setMeasurements(measurements);
    }) as unknown as number;
  }

  return measurements;
}
