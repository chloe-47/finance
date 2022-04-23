import DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import type { FinanceRule } from './FinanceRule';
import FinanceState from './FinanceState';
import type { FinanceStateProps } from './FinanceStateProps';
import type { TimeSeriesTopLevelConfig } from './TimeSeriesTopLevelConfig';
import TimeSeriesTopLevelConfigBuilder from './TimeSeriesTopLevelConfigBuilder';

type Args = {
  initialState: FinanceStateProps;
  rules: ReadonlyArray<FinanceRule>;
  yearsAhead: number;
};

export default class FinanceSystem {
  args: Args;
  timeSeriesConfigs: ReadonlyArray<TimeSeriesTopLevelConfig> = [];

  constructor(args: Args) {
    this.args = args;
  }

  resolve(): this {
    const dateRange = DateRange.nextYears(this.args.yearsAhead);
    const builders = [
      builder('Cash', (state) => state.cash),
      builder('Expenses', (state) => state.monthlyExpenses),
      builder('Income', (state) => state.monthlyIncome),
    ];

    let state: FinanceState = new FinanceState(this.args.initialState);

    dateRange.dates.forEach((date: Date_): void => {
      builders.forEach((builder) => builder.addPoint(date, state));
      state = state.getNextState(this.args.rules);
    });

    this.timeSeriesConfigs = builders.map((builder) =>
      builder.getTopLevelConfig(),
    );

    return this;

    function builder(
      label: string,
      getValue: (state: FinanceState) => number,
    ): TimeSeriesTopLevelConfigBuilder {
      return new TimeSeriesTopLevelConfigBuilder({
        dateRange,
        getValue,
        label,
      });
    }
  }

  getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return this.timeSeriesConfigs;
  }
}
