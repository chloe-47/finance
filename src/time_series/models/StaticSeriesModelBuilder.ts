import type DateRange from 'src/dates/DateRange';
import SeriesData from '../SeriesData';
import type { Point } from '../SeriesTypes';
import StaticSeriesModel from './StaticSeriesModel';
import type { TimeSeriesModel } from './TimeSeriesModel';

export default class StaticSeriesModelBuilder {
  readonly dateRange: DateRange;
  readonly label: string;
  readonly points: Array<Point>;

  constructor({ dateRange, label }: { dateRange: DateRange; label: string }) {
    this.label = label;
    this.dateRange = dateRange;
    this.points = [];
  }

  addPoint(point: Point): void {
    this.points.push(point);
  }

  getModel(): TimeSeriesModel {
    return new StaticSeriesModel({
      dateRange: this.dateRange,
      label: this.label,
      seriesData: new SeriesData([
        {
          label: this.label,
          points: this.points,
        },
      ]),
    });
  }
}
