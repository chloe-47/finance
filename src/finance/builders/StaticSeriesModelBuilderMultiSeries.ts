import type DateRange from 'src/dates/DateRange';
import StaticSeriesModel from '../../time_series/models/StaticSeriesModel';
import type { TimeSeriesModel } from '../../time_series/models/TimeSeriesModel';
import SeriesData from '../../time_series/SeriesData';
import type { Point } from '../../time_series/SeriesTypes';

type Props = Readonly<{
  dateRange: DateRange;
  label: string;
  seriesLabels: ReadonlyArray<string>;
}>;

export default class StaticSeriesModelBuilderMultiSeries {
  readonly props: Props;
  readonly points: Map<string, Array<Point>>;

  constructor(props: Props) {
    this.props = props;
    this.points = new Map(
      props.seriesLabels.map((label: string): [string, Array<Point>] => [
        label,
        [],
      ]),
    );
    Object.freeze(this);
  }

  addPoint(seriesLabel: string, point: Point): void {
    this.points.get(seriesLabel)?.push(point);
  }

  getModel(): TimeSeriesModel {
    return new StaticSeriesModel({
      dateRange: this.props.dateRange,
      label: this.props.label,
      seriesData: new SeriesData(
        Array.from(this.points.entries()).map(([label, points]) => ({
          label,
          points,
        })),
      ),
    });
  }
}
