import type { MeasurementSpec } from './ComponentsToMeasureStore';
import ComponentsToMeasureStore from './ComponentsToMeasureStore';

export default function subscribeToMeasurements(
  key: string,
  spec: MeasurementSpec<unknown>,
): void {
  const allSpecs = new Map(ComponentsToMeasureStore.getValue().entries());
  const listeners: Set<MeasurementSpec<unknown>> =
    allSpecs.get(key) ?? new Set();
  if (!listeners.has(spec)) {
    spec.onMeasure(undefined);
    listeners.add(spec);
    allSpecs.set(key, listeners);
    ComponentsToMeasureStore.update(allSpecs);
  }
}
