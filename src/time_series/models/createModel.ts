import type { TimeSeriesChartDefinition } from '../SeriesTypes';
import type { Listener, TimeSeriesModel } from './TimeSeriesModel';

type Args = {
  initial: TimeSeriesChartDefinition;
};

type Updater = (
  oldValue: TimeSeriesChartDefinition,
) => TimeSeriesChartDefinition;

type Return = {
  model: TimeSeriesModel;
  update: (updater: Updater) => void;
};

export default function createModel({ initial }: Args): Return {
  const listeners: Set<Listener> = new Set();
  let value: TimeSeriesChartDefinition = initial;

  const model = {
    getInitialState,
    subscribe,
    unsubscribe,
  };

  return {
    model,
    update,
  };

  function update(updater: Updater): void {
    const newValue = updater(value);
    value = newValue;
    listeners.forEach((listener) => listener(newValue));
  }

  function getInitialState(): TimeSeriesChartDefinition {
    return initial;
  }

  function subscribe(listener: Listener): void {
    listeners.add(listener);
  }

  function unsubscribe(listener: Listener): void {
    listeners.delete(listener);
  }
}
