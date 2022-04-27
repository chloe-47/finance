import DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import TimeSeriesTopLevelConfigBuilder from './builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import createComponentObject from './components/createComponentObject';
import type { FinanceRule } from './FinanceRule';
import FinanceState from './FinanceState';
import type { FinanceStateStaticConfig } from './FinanceStateProps';
import type { TimeSeriesTopLevelConfig } from './TimeSeriesTopLevelConfig';

type Props = {
  initialState: FinanceStateStaticConfig;
  rules: ReadonlyArray<FinanceRule>;
  timeSpan: {
    currentAge: number;
    deadAt: number;
  };
};

export default class FinanceSystem {
  private props: Props;
  private timeSeriesConfigs:
    | ReadonlyArray<TimeSeriesTopLevelConfig>
    | undefined;

  public constructor(props: Props) {
    this.props = props;
  }

  public resolve(): this {
    const { rules, timeSpan } = this.props;
    const { deadAt, currentAge } = timeSpan;
    const yearsAhead = deadAt - currentAge + 1;
    const dateRange = DateRange.nextYears(yearsAhead);
    let state: FinanceState = new FinanceState({
      ...this.props.initialState,
      components: this.props.initialState.components.map((component) =>
        createComponentObject({ component, dateRange }),
      ),
      coreBuilders: {
        cash: builder('Cash'),
        expenses: builder('Expenses'),
        income: builder('Income'),
      },
      dateRange,
    });

    dateRange.dates.forEach((date: Date_): void => {
      state = state.getNextStateAndWriteDataToChartBuildersForThisDate({
        date,
        rules,
      });
    });

    this.timeSeriesConfigs = state.getTimeSeriesConfigs();

    return this;

    function builder(label: string): TimeSeriesTopLevelConfigBuilder {
      return new TimeSeriesTopLevelConfigBuilder({
        dateRange,
        label,
      });
    }
  }

  getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    if (this.timeSeriesConfigs === undefined) {
      throw new Error(
        'Must call FinanceSystem.resolve() before FinanceSystem.getTimeSeriesConfigs()',
      );
    }
    return this.timeSeriesConfigs;
  }
}
