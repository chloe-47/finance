import type { ChartSize, Point, Series } from 'src/time_series/SeriesTypes';
import type { ValueRange } from './getValueRange';

export type Coordinates = {
  cx: number;
  cy: number;
  r: number;
};

type Mapper = {
  getCoordinates: (point: Point) => Coordinates;
};

type Args = {
  chartSize: ChartSize;
  seriesList: Array<Series>;
  valueRange: ValueRange;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
};

export default function createCoordinateMapper({
  chartSize,
  seriesList,
  valueRange,
  xMax,
  xMin,
  yMax,
  yMin,
}: Args): Mapper {
  const { height, pointRadius } = chartSize;
  const innerWidth = xMax - xMin;
  const innerHeight = yMax - yMin;
  const { minValue, maxValue } = valueRange;
  let minDate: Date = new Date();
  let maxDate: Date = new Date();
  seriesList.forEach((series: Series): void => {
    series.points.forEach(({ date }: Point): void => {
      if (date < minDate) {
        minDate = date;
      }
      if (date > maxDate) {
        maxDate = date;
      }
    });
  });

  const minDateValue = minDate.getTime();
  const maxDateValue = maxDate.getTime();
  const dateRange = Math.max(maxDateValue - minDateValue, 1000);
  const dateMultiplier = innerWidth / dateRange;

  const valueRangeSize = maxValue - minValue;
  const valueMultiplier = innerHeight / valueRangeSize;

  function getCoordinates({ date, value }: Point): Coordinates {
    return {
      cx: xMin + (date.getTime() - minDateValue) * dateMultiplier,
      cy: height - yMin - (value - minValue) * valueMultiplier,
      r: pointRadius,
    };
  }

  return { getCoordinates };
}
