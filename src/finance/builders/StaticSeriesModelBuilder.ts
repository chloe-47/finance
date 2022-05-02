import type DateRange from 'src/dates/DateRange';
import StaticSeriesModel from '../../time_series/models/StaticSeriesModel';
import type { TimeSeriesModel } from '../../time_series/models/TimeSeriesModel';
import SeriesData from '../../time_series/SeriesData';
import type { Point, Series, SeriesStyle } from '../../time_series/SeriesTypes';

export type Props = Readonly<{
  dateRange: DateRange;
  label: string;
  style: SeriesStyle;
}>;

export default class StaticSeriesModelBuilder {
  readonly props: Props;
  readonly series: Series;

  constructor(props: Props) {
    this.props = props;
    this.series = { label: props.label, points: [], style: props.style };
    Object.freeze(this);
  }

  addPoint(point: Point): void {
    this.series.points.push(point);
  }

  getModel(): TimeSeriesModel {
    return new StaticSeriesModel({
      dateRange: this.props.dateRange,
      label: this.props.label,
      seriesData: new SeriesData([this.series]),
    });
  }
}
