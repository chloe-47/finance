import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { Subsystem } from './Subsystem';

export type StaticConfig = Readonly<{
  currentMonthlyValue: number;
}>;

export type Props = Readonly<
  StaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
  }
>;

export default class UncategorizedExpensesSubsystem implements Subsystem {
  private readonly props: Props;

  private constructor(props: Props) {
    this.props = props;
  }

  public static fromStaticConfig({
    dateRange,
    uncategorizedExpenses: staticConfig,
  }: {
    dateRange: DateRange;
    uncategorizedExpenses: StaticConfig;
  }): UncategorizedExpensesSubsystem {
    return new UncategorizedExpensesSubsystem({
      ...staticConfig,
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderSingleSeries({
        dateRange,
        label: 'Expenses',
      }),
    });
  }

  public doesReportExpenses(): boolean {
    return true;
  }

  public doesReportIncome(): boolean {
    return false;
  }

  public resolve(api: ResolveExecAPI): UncategorizedExpensesSubsystem {
    const expenseValue = this.props.currentMonthlyValue;
    const { amountWithdrawn } = api.withdrawCashForExpenseIfAvailable(
      this,
      expenseValue,
    );
    this.props.timeSeriesBuilder.addPoint(api.date, amountWithdrawn);
    return this;
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [];
  }
}
