import DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import flatten from 'src/utils/flatten';
import TimeSeriesTopLevelConfigBuilder from './builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { FinanceRule } from './FinanceRule';
import FinanceState from './FinanceState';
import type { FinanceStateProps } from './FinanceStateProps';
import type { TimeSeriesTopLevelConfig } from './TimeSeriesTopLevelConfig';

type Props = {
  initialState: FinanceStateProps;
  rules: ReadonlyArray<FinanceRule>;
  timeSpan: {
    currentAge: number;
    deadAt: number;
  };
};

export default class FinanceSystem {
  props: Props;
  timeSeriesConfigs: ReadonlyArray<TimeSeriesTopLevelConfig> = [];

  constructor(props: Props) {
    this.props = props;
  }

  resolve(): this {
    const { deadAt, currentAge } = this.props.timeSpan;
    const yearsAhead = deadAt - currentAge + 1;
    const dateRange = DateRange.nextYears(yearsAhead);
    let state: FinanceState = new FinanceState(this.props.initialState);

    const builders = [
      builder('Cash', (state) => state.cash),
      builder('Expenses', (state) => state.monthlyExpenses),
      builder('Income', (state) => state.monthlyIncome),
      ...flatten(
        state.components.map((component) =>
          component.createBuilders({ dateRange, state }),
        ),
      ),
    ];

    dateRange.dates.forEach((date: Date_): void => {
      builders.forEach((builder) => builder.addPoint(date, state));
      state = state.getNextState(this.props.rules);
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
