import type { Point, Series } from '../SeriesTypes';
import type { ValuesMinAndMax } from '../ValuesMinAndMax';

export default function computeValuesMinAndMax(
  seriesList: ReadonlyArray<Series>,
): ValuesMinAndMax {
  let min = 0;
  let max = 0;
  seriesList.forEach(({ points }: Series): void => {
    points.forEach(({ value }: Point): void => {
      if (value < min) {
        min = value;
      }
      if (value > max) {
        max = value;
      }
    });
  });
  if (min !== 0) {
    throw new Error('computeValuesMinAndMax does not support negative values');
  }
  return { max, min };
}
