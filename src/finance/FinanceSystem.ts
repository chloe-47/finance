import DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import FinanceState from './FinanceState';
import type { TimeSeriesTopLevelConfig } from './TimeSeriesTopLevelConfig';

type Props = {
  rules: ReadonlyArray<FinanceRuleStaticConfig>;
  subsystems: FinanceSubsystemStaticConfig;
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
      dateRange,
      subsystems: createSubsystemsObject(this.props.subsystems),
    });

    dateRange.dates.forEach((date: Date_): void => {
      state = state.getNextStateAndWriteDataToChartBuildersForThisDate({
        date,
        rules,
      });
    });

    this.timeSeriesConfigs = state.getTimeSeriesConfigs();

    return this;
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
