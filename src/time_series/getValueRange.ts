import getLabelValues from './getLabelValues';
import type { ValuesMinAndMax } from './ValuesMinAndMax';

export type ValueRange = Readonly<{
  labelValues: Array<number>;
  minValue: number;
  maxValue: number;
}>;

export default function getValueRange(
  valuesMinAndMax: ValuesMinAndMax,
  step: number,
): ValueRange {
  const { min: minValue, max: maxValue } = valuesMinAndMax;
  const labelValues = getLabelValues({ maxValue, minValue }, step);
  const maxLabelValue = Math.max(...labelValues);
  return {
    labelValues,
    maxValue: maxLabelValue,
    minValue,
  };
}

export function valueRangeKey(
  { min, max }: ValuesMinAndMax,
  step: number | undefined,
): string {
  return `${min}:${max}:${step ?? 'undefined'}`;
}
