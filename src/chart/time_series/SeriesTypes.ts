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

export type TimeSeriesChartDefinition = {
  chartSize: ChartSize;
  seriesList: Array<Series>;
};
