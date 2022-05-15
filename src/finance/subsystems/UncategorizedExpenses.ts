import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { Subsystem } from './shared/Subsystem';
import SubsystemBase from './shared/SubsystemBase';

export type StaticConfig = Readonly<{
  currentMonthlyValue: number;
}>;

export type Props = Readonly<
  StaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
  }
>;

export default class UncategorizedExpenses
  extends SubsystemBase
  implements Subsystem
{
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

  public resolve(api: ResolveExecAPI): UncategorizedExpenses {
    const expenseValue = this.props.currentMonthlyValue;
    const { amountWithdrawn } = api.withdrawCashForExpenseIfAvailable(
      this,
      expenseValue,
    );
    this.props.timeSeriesBuilder.addPoint(api.date, amountWithdrawn);
    return this;
  }
}
