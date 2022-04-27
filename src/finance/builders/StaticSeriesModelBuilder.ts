import type DateRange from 'src/dates/DateRange';
import StaticSeriesModel from '../../time_series/models/StaticSeriesModel';
import type { TimeSeriesModel } from '../../time_series/models/TimeSeriesModel';
import SeriesData from '../../time_series/SeriesData';
import type { Point } from '../../time_series/SeriesTypes';

type Props = Readonly<{ dateRange: DateRange; label: string }>;

export default class StaticSeriesModelBuilder {
  readonly props: Props;
  readonly points: Array<Point>;

  constructor(props: Props) {
    this.props = props;
    this.points = [];
    Object.freeze(this);
  }

  addPoint(point: Point): void {
    this.points.push(point);
  }

  getModel(): TimeSeriesModel {
    return new StaticSeriesModel({
      dateRange: this.props.dateRange,
      label: this.props.label,
      seriesData: new SeriesData([
        {
          label: this.props.label,
          points: this.points,
        },
      ]),
    });
  }
}
