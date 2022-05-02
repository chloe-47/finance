import type DateRange from 'src/dates/DateRange';
import StaticSeriesModel from '../../time_series/models/StaticSeriesModel';
import type { TimeSeriesModel } from '../../time_series/models/TimeSeriesModel';
import SeriesData from '../../time_series/SeriesData';
import type { Point, Series, SeriesStyle } from '../../time_series/SeriesTypes';

type Props = Readonly<{
  dateRange: DateRange;
  label: string;
}>;

type AddPointArgs = Readonly<{
  label: string;
  point: Point;
  style: SeriesStyle;
}>;

export default class StaticSeriesModelBuilderMultiSeries {
  readonly props: Props;
  readonly series: Map<string, Series>;

  constructor(props: Props) {
    this.props = props;
    this.series = new Map();
    Object.freeze(this);
  }

  addPoint({ label, point, style }: AddPointArgs): void {
    const series: Series = this.series.get(label) ?? {
      label,
      points: [],
      style,
    };
    series.points.push(point);
    this.series.set(label, series);
  }

  getModel(): TimeSeriesModel {
    return new StaticSeriesModel({
      dateRange: this.props.dateRange,
      label: this.props.label,
      seriesData: new SeriesData(Array.from(this.series.values())),
    });
  }
}
