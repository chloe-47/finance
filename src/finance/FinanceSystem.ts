import DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import type { StaticConfig as FinanceRuleStaticConfig } from './FinanceRule';
import FinanceRule from './FinanceRule';
import FinanceState from './FinanceState';
import type { FinanceSubsystemStaticConfig } from './subsystems/FinanceStateSubsystemsTypes';
import type { TimeSeriesTopLevelConfig } from './TimeSeriesTopLevelConfig';

type Props = Readonly<{
  rules: ReadonlyArray<FinanceRuleStaticConfig>;
  subsystems: FinanceSubsystemStaticConfig;
  timeSpan: Readonly<{
    currentAge: number;
    deadAt: number;
  }>;
}>;

export default class FinanceSystem {
  private props: Props;
  private timeSeriesConfigs:
    | ReadonlyArray<TimeSeriesTopLevelConfig>
    | undefined;

  public constructor(props: Props) {
    this.props = props;
  }

  public resolve(): this {
    const { rules: rules_, timeSpan } = this.props;
    const { deadAt, currentAge } = timeSpan;
    const yearsAhead = deadAt - currentAge + 1;
    const dateRange = DateRange.nextYears(yearsAhead);
    const rules = rules_.map((r) => FinanceRule.fromStaticConfig(r));
    let state: FinanceState = FinanceState.fromStaticConfig({
      dateRange,
      staticConfig: { subsystems: this.props.subsystems },
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

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    if (this.timeSeriesConfigs === undefined) {
      throw new Error(
        'Must call FinanceSystem.resolve() before FinanceSystem.getTimeSeriesConfigs()',
      );
    }
    return this.timeSeriesConfigs;
  }
}
