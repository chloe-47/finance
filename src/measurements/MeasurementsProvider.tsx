import * as React from 'react';
import useStore from '../store/useStore';
import ComponentsToMeasureStore, {
  Measurement,
  MeasurementSpec,
} from './ComponentsToMeasureStore';

export default function MeasurementsProvider(): JSX.Element {
  const allSpecs = useStore(ComponentsToMeasureStore);
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{ opacity: 0, position: 'absolute', top: -1000, width: 10000 }}
      >
        {Array.from(allSpecs.values()).map(
          (specs: Set<MeasurementSpec<unknown>>) => {
            const { values, render, valToString } = Array.from(
              specs,
            )[0] as unknown as MeasurementSpec<unknown>;
            return (
              <MeasureContainer
                key={values.map(valToString).join(';')}
                onMeasure={(...args) =>
                  specs.forEach(({ onMeasure }) => onMeasure(...args))
                }
                render={render}
                valToString={valToString}
                values={values}
              />
            );
          },
        )}
      </div>
    </div>
  );
}

function MeasureContainer<T>({
  values,
  render,
  onMeasure,
  valToString,
}: MeasurementSpec<T>): JSX.Element {
  const refs = React.useRef<Map<T, Measurement>>(new Map());
  const timeout = React.useRef<number | undefined>();
  return (
    <div>
      {values.map((val: T): JSX.Element => {
        return (
          <div
            key={valToString(val)}
            ref={(r) => {
              if (r != null) {
                refs.current.set(val, {
                  height: r.clientHeight,
                  width: r.clientWidth,
                });
                clearTimeout(timeout.current);
                timeout.current = setTimeout(() => {
                  onMeasure(refs.current);
                }) as unknown as number;
              }
            }}
            style={{ position: 'absolute' }}
          >
            {render(val)}
          </div>
        );
      })}
    </div>
  );
}
