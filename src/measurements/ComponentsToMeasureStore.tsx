import createStore from 'src/store/createStore';

export type Measurement = {
  height: number;
  width: number;
};

export type Measurements<T> = Map<T, Measurement>;

export type MeasurementSpec<T> = {
  values: Array<T>;
  render: (val: T) => JSX.Element;
  onMeasure: (measurements: Measurements<T>) => void;
  valToString: (val: T) => string;
};

type AllMeasurementSpecs = Map<unknown, MeasurementSpec<unknown>>;

const ComponentsToMeasureStore = createStore<AllMeasurementSpecs>(new Map());

export default ComponentsToMeasureStore;
