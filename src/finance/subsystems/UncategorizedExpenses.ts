import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import Subsystem from './shared/Subsystem';

export type StaticConfig = Readonly<{
  currentMonthlyValue: number;
}>;

export type Props = Readonly<
  StaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
  }
>;

export default class UncategorizedExpenses extends Subsystem<UncategorizedExpenses> {
  private readonly props: Props;

  private constructor(props: Props) {
    super();
    this.props = props;
  }

  public static fromStaticConfig({
    dateRange,
    uncategorizedExpenses: staticConfig,
  }: {
    dateRange: DateRange;
    uncategorizedExpenses: StaticConfig;
  }): UncategorizedExpenses {
    return new UncategorizedExpenses({
      ...staticConfig,
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderSingleSeries({
        dateRange,
        label: 'Expenses',
        style: { color: 'pink', thickness: 'thick' },
      }),
    });
  }

  public override doesReportExpenses(): boolean {
    return true;
  }

  public override resolveImpl(api: ResolveExecAPI): UncategorizedExpenses {
    const expenseValue = this.props.currentMonthlyValue;
    const { amountWithdrawn } =
      api.withdrawCashForExpenseIfAvailable<UncategorizedExpenses>(
        this,
        expenseValue,
      );
    this.props.timeSeriesBuilder.addPoint(api.date, amountWithdrawn);
    return new UncategorizedExpenses(this.props);
  }
}
