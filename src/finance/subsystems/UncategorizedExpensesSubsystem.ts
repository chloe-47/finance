import type TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';

export type UncategorizedExpensesSubsystemStaticConfig = Readonly<{
  currentMonthlyValue: number;
}>;

export type UncategorizedExpensesSubsystemProps =
  UncategorizedExpensesSubsystemStaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
  };

export default class UncategorizedExpensesSubsystem {
  private props: UncategorizedExpensesSubsystemStaticConfig;

  constructor(props: UncategorizedExpensesSubsystemStaticConfig) {
    this.props = props;
  }
}
