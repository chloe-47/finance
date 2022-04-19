import type DateRange from 'src/dates/DateRange';
import type { ChartSize, Point } from 'src/time_series/SeriesTypes';
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
  dateRange: DateRange;
  valueRange: ValueRange;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
};

export default function createCoordinateMapper({
  chartSize,
  dateRange,
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

  const minDateValue = dateRange.minTimestamp;
  const maxDateValue = dateRange.maxTimestamp;
  const dateRangeSpan = Math.max(maxDateValue - minDateValue, 1000);
  const dateMultiplier = innerWidth / dateRangeSpan;

  const valueRangeSize = maxValue - minValue;
  const valueMultiplier = innerHeight / valueRangeSize;

  function getCoordinates({ date, value }: Point): Coordinates {
    return {
      cx: xMin + (date.timestamp() - minDateValue) * dateMultiplier,
      cy: height - yMin - (value - minValue) * valueMultiplier,
      r: pointRadius,
    };
  }

  return { getCoordinates };
}
