import type DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import StaticSeriesModelBuilder from 'src/time_series/models/StaticSeriesModelBuilder';
import type FinanceState from './FinanceState';
import type { TimeSeriesTopLevelConfig } from './TimeSeriesTopLevelConfig';

type Props = Readonly<{
  dateRange: DateRange;
  label: string;
  getValue: (state: FinanceState) => number;
}>;

export default class TimeSeriesTopLevelConfigBuilder {
  readonly props: Props;
  builder: StaticSeriesModelBuilder;

  constructor(props: Props) {
    this.props = props;
    this.builder = new StaticSeriesModelBuilder({
      dateRange: props.dateRange,
      label: props.label,
    });
    Object.freeze(this);
  }

  addPoint(date: Date_, state: FinanceState): void {
    this.builder.addPoint({ date, value: this.props.getValue(state) });
  }

  getTopLevelConfig(): TimeSeriesTopLevelConfig {
    return {
      key: this.props.label,
      model: this.builder.getModel(),
    };
  }
}
