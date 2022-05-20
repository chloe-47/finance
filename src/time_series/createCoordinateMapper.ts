import type DateRange from 'src/dates/DateRange';
import type { ChartSize, Point } from 'src/time_series/SeriesTypes';
import type { ValueRange } from './getValueRange';

export type Coordinates = Readonly<{
  cx: number;
  cy: number;
  r: number;
}>;

export type Mapper = Readonly<{
  getCoordinates: (point: Point) => Coordinates;
  zeroYCoord: number | undefined;
}>;

type Args = Readonly<{
  chartSize: ChartSize;
  dateRange: DateRange;
  valueRange: ValueRange;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}>;

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
      cy: getYCoordinate(value),
      r: pointRadius,
    };
  }

  function getYCoordinate(value: number): number {
    return height - yMin - (value - minValue) * valueMultiplier;
  }

  const zeroYCoord = minValue >= 0 ? undefined : getYCoordinate(0);

  return { getCoordinates, zeroYCoord };
}
