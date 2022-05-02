import type DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import type SeriesData from './SeriesData';

export type Point = Readonly<{
  date: Date_;
  value: number;
}>;

export type SeriesStyle = Readonly<{
  color: 'pink' | 'gray';
  thickness: 'thin' | 'thick';
}>;

export type Series = {
  label: string;
  points: Array<Point>;
  style: SeriesStyle;
};

export type ChartSize = Readonly<{
  width: number;
  height: number;
  pointRadius: number;
}>;

export type MaybeIncompleteChartSize = Readonly<{
  width: number | undefined;
  height: number | undefined;
  pointRadius: number;
}>;

export type TimeSeriesChartDefinition = Readonly<{
  dateRange: DateRange;
  label: string;
  seriesData: SeriesData;
}>;

export type TimeSeriesChartViewProps = Readonly<{
  chartSize: ChartSize;
}>;

export type TimeSeriesChartDefinitionWithViewProps = Readonly<
  TimeSeriesChartDefinition & TimeSeriesChartViewProps
>;

export type TimeSeriesChartDefinitionWithMaybeIncompleteChartSize = Readonly<
  Omit<TimeSeriesChartDefinition, 'chartSize'> & {
    chartSize: MaybeIncompleteChartSize;
  }
>;

export function getCompleteChartSize({
  width,
  height,
  pointRadius,
}: MaybeIncompleteChartSize): ChartSize | undefined {
  if (width === undefined || height === undefined) {
    return undefined;
  }
  return {
    height,
    pointRadius,
    width,
  };
}
