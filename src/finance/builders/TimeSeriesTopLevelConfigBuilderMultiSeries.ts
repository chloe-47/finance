import type DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import type { SeriesStyle } from 'src/time_series/SeriesTypes';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import StaticSeriesModelBuilderMultiSeries from './StaticSeriesModelBuilderMultiSeries';
import type { TimeSeriesTopLevelConfigBuilder } from './TimeSeriesTopLevelConfigBuilder';

type Props = Readonly<{
  dateRange: DateRange;
  label: string;
}>;

export default class TimeSeriesTopLevelConfigBuilderMultiSeries
  implements TimeSeriesTopLevelConfigBuilder
{
  readonly props: Props;
  readonly builder: StaticSeriesModelBuilderMultiSeries;

  constructor(props: Props) {
    this.props = props;
    this.builder = new StaticSeriesModelBuilderMultiSeries({
      dateRange: props.dateRange,
      label: props.label,
    });
    Object.freeze(this);
  }

  addPoint({
    date,
    values,
    style,
  }: Readonly<{
    date: Date_;
    values: ReadonlyMap<string, number>;
    style: SeriesStyle;
  }>): void {
    Array.from(values.entries()).forEach(([label, value]) => {
      this.builder.addPoint({ label, point: { date, value }, style });
    });
  }

  addPointSingleSeries({
    date,
    series,
    style,
    value,
  }: Readonly<{
    date: Date_;
    series: string;
    value: number;
    style: SeriesStyle;
  }>): void {
    this.builder.addPoint({ label: series, point: { date, value }, style });
  }

  getTopLevelConfig(): TimeSeriesTopLevelConfig {
    return {
      key: this.props.label,
      model: this.builder.getModel(),
    };
  }
}
