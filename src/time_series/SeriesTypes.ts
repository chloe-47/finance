export type Point = {
  date: Date;
  value: number;
};

export type Series = {
  label: string;
  points: Array<Point>;
};

export type ChartSize = {
  width: number;
  height: number;
  pointRadius: number;
};

export type MaybeIncompleteChartSize = {
  width: number | undefined;
  height: number | undefined;
  pointRadius: number;
};

export type TimeSeriesChartDefinition = {
  chartSize: ChartSize;
  seriesList: Array<Series>;
};

export type TimeSeriesChartDefinitionWithMaybeIncompleteChartSize = Omit<
  TimeSeriesChartDefinition,
  'chartSize'
> & {
  chartSize: MaybeIncompleteChartSize;
};

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
