import type DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import StaticSeriesModelBuilderMultiSeries from './StaticSeriesModelBuilderMultiSeries';
import type { TimeSeriesTopLevelConfigBuilder } from './TimeSeriesTopLevelConfigBuilder';

type Props = Readonly<{
  dateRange: DateRange;
  label: string;
  seriesLabels: ReadonlyArray<string>;
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
      seriesLabels: props.seriesLabels,
    });
    Object.freeze(this);
  }

  addPoint(date: Date_, values: ReadonlyMap<string, number>): void {
    Array.from(values.entries()).forEach(([label, value]) => {
      this.builder.addPoint(label, { date, value });
    });
  }

  getTopLevelConfig(): TimeSeriesTopLevelConfig {
    return {
      key: this.props.label,
      model: this.builder.getModel(),
    };
  }
}
