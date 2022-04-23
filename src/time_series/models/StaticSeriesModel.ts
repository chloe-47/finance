import type { TimeSeriesChartDefinition } from '../SeriesTypes';
import type { Listener, TimeSeriesModel } from './TimeSeriesModel';

export default class StaticSeriesModel implements TimeSeriesModel {
  readonly definition: TimeSeriesChartDefinition;

  constructor(definition: TimeSeriesChartDefinition) {
    this.definition = definition;
  }

  getInitialState(): TimeSeriesChartDefinition {
    return this.definition;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  subscribe(_listener: Listener): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unsubscribe(_listener: Listener): void {}
}
