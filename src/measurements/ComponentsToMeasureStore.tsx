import createStore from 'src/store/createStore';

export type Measurement = Readonly<{
  height: number;
  width: number;
}>;

export type Measurements<T> = ReadonlyMap<T, Measurement>;

export type MeasurementSpec<T> = {
  values: ReadonlyArray<T>;
  render: (val: T) => JSX.Element;
  onMeasure: (measurements: Measurements<T> | undefined) => void;
  valToString: (val: T) => string;
};

type AllMeasurementSpecs = ReadonlyMap<string, Set<MeasurementSpec<unknown>>>;

const ComponentsToMeasureStore = createStore<AllMeasurementSpecs>(new Map());

export default ComponentsToMeasureStore;
