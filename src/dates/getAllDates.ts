import type { Point, Series } from 'src/time_series/SeriesTypes';

export default function getAllDates(seriesList: Array<Series>): Array<Date> {
  const dateNumbers: Set<number> = new Set();
  seriesList.forEach(({ points }: Series): void => {
    points.forEach(({ date }: Point): void => {
      dateNumbers.add(date.getTime());
    });
  });
  return Array.from(dateNumbers)
    .sort((a, b) => a - b)
    .map((dateNumber) => new Date(dateNumber));
}
