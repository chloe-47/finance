import type { Point, Series } from 'src/time_series/SeriesTypes';
import getLabelValues from './getLabelValues';
import type { ValuesMinAndMax } from './ValuesMinAndMax';

export type ValueRange = {
  labelValues: Array<number>;
  minValue: number;
  maxValue: number;
};

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
  seriesList: ReadonlyArray<Series>,
  step: number | undefined,
): string {
  let minValue = 0;
  let maxValue = 0;
  seriesList.forEach(({ points }: Series): void => {
    points.forEach(({ value }: Point): void => {
      if (value < minValue) {
        minValue = value;
      }
      if (value > maxValue) {
        maxValue = value;
      }
    });
  });
  return `${minValue}:${maxValue}:${step ?? 'undefined'}`;
}
