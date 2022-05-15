import type DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import type FinanceRule from './FinanceRule';
import type {
  FinanceStateProps,
  FinanceStateStaticConfig,
} from './FinanceStateProps';
import FinanceStateSubsystems from './subsystems/shared/FinanceStateSubsystems';
import type { TimeSeriesTopLevelConfig } from './TimeSeriesTopLevelConfig';

type NextStateArgs = Readonly<{
  rules: ReadonlyArray<FinanceRule>;
  date: Date_;
}>;

export default class FinanceState {
  private readonly props: FinanceStateProps;

  private constructor(props: FinanceStateProps) {
    this.props = props;
  }

  public static fromStaticConfig({
    staticConfig: { subsystems },
    dateRange,
  }: {
    staticConfig: FinanceStateStaticConfig;
    dateRange: DateRange;
  }): FinanceState {
    return new FinanceState({
      dateRange,
      subsystems: FinanceStateSubsystems.fromStaticConfig({
        dateRange,
        staticConfig: subsystems,
      }),
    });
  }

  public getNextStateAndWriteDataToChartBuildersForThisDate({
    rules,
    date,
  }: NextStateArgs): FinanceState {
    const nextSubsystems =
      this.props.subsystems.getNextStateAndWriteDataToChartBuildersForThisDate({
        date,
        rules,
      });

    const nextProps: FinanceStateProps = {
      ...this.props,
      subsystems: nextSubsystems,
    };

    return new FinanceState(nextProps);
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return this.props.subsystems.getTimeSeriesConfigs();
  }
}
