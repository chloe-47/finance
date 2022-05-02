import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { Subsystem } from './Subsystem';

export type StaticConfig = Readonly<Record<never, never>>;

export type Props = Readonly<
  StaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
  }
>;

export default class TotalExpensesSubsystem implements Subsystem {
  private readonly props: Props;
  private dynamicTotalExpenses: number;

  private constructor(props: Props) {
    this.props = props;
    this.dynamicTotalExpenses = 0;
  }

  public static fromStaticConfig({
    dateRange,
  }: {
    dateRange: DateRange;
  }): TotalExpensesSubsystem {
    return new TotalExpensesSubsystem({
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderSingleSeries({
        dateRange,
        label: 'Expenses',
        style: { color: 'pink', thickness: 'thick' },
      }),
    });
  }

  public doesReportExpenses(): boolean {
    return false;
  }

  public doesReportIncome(): boolean {
    return false;
  }

  public resolve(api: ResolveExecAPI): TotalExpensesSubsystem {
    api.resolveAllExpenses();
    this.props.timeSeriesBuilder.addPoint(api.date, this.dynamicTotalExpenses);
    return new TotalExpensesSubsystem({
      ...this.props,
    });
  }

  public dynamicReportExpense(amount: number): void {
    this.dynamicTotalExpenses += amount;
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }

  public get resolvedValue(): number {
    return this.dynamicTotalExpenses;
  }
}
