import type { TimeSeriesChartDefinition } from '../SeriesTypes';

export type Listener = (definition: TimeSeriesChartDefinition) => void;

export interface TimeSeriesModel {
  getInitialState: () => TimeSeriesChartDefinition;
  subscribe: (listener: Listener) => void;
  unsubscribe: (listener: Listener) => void;
}
