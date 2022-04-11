import type {
  ChartSize,
  Point,
  Series,
} from 'src/chart/time_series/SeriesTypes';

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
  xMax: number;
  xMin: number;
};

export default function createCoordinateMapper({
  chartSize,
  seriesList,
  xMax,
  xMin,
}: Args): Mapper {
  const { height, pointRadius } = chartSize;
  const innerWidth = xMax - xMin;
  const innerHeight = height - pointRadius * 2;
  let minDate: Date = new Date();
  let maxDate: Date = new Date();
  let minValue = 0;
  let maxValue = 1;
  seriesList.forEach((series: Series): void => {
    series.points.forEach(({ date, value }: Point): void => {
      if (date < minDate) {
        minDate = date;
      }
      if (date > maxDate) {
        maxDate = date;
      }
      if (value < minValue) {
        minValue = value;
      }
      if (value > maxValue) {
        maxValue = value;
      }
    });
  });

  const minDateValue = minDate.getTime();
  const maxDateValue = maxDate.getTime();
  const dateRange = Math.max(maxDateValue - minDateValue, 1000);
  const dateMultiplier = innerWidth / dateRange;

  minValue = minValue * 1.2;
  maxValue = maxValue * 1.2;
  const valueRange = maxValue - minValue;
  const valueMultiplier = innerHeight / valueRange;

  function getCoordinates({ date, value }: Point): Coordinates {
    return {
      cx: xMin + (date.getTime() - minDateValue) * dateMultiplier,
      cy: height - pointRadius - (value - minValue) * valueMultiplier,
      r: pointRadius,
    };
  }

  return { getCoordinates };
}
