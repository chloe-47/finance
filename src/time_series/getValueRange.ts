import type { Point, Series } from 'src/time_series/SeriesTypes';
import getLabelValues from './getLabelValues';

export type ValueRange = {
  labelValues: Array<number>;
  minValue: number;
  maxValue: number;
};

export default function getValueRange(
  seriesList: Array<Series>,
  step: number,
): ValueRange {
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
  if (minValue !== 0) {
    throw new Error('getValueRange does not support negative values');
  }
  const notRounded = {
    maxValue,
    minValue,
  };
  const labelValues = getLabelValues(notRounded, step);
  const maxLabelValue = Math.max(...labelValues);
  return {
    labelValues,
    maxValue: maxLabelValue,
    minValue,
  };
}

export function valueRangeKey(
  seriesList: Array<Series>,
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
