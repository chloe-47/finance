import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { Subsystem } from './shared/Subsystem';
import SubsystemBase from './shared/SubsystemBase';

export type StaticConfig = Readonly<Record<never, never>>;

export type Props = Readonly<
  StaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
  }
>;

export default class TotalExpenses extends SubsystemBase implements Subsystem {
  private readonly props: Props;
  private dynamicTotalExpenses: number;

  private constructor(props: Props) {
    super();
    this.props = props;
    this.dynamicTotalExpenses = 0;
  }

  public static fromStaticConfig({
    dateRange,
  }: {
    dateRange: DateRange;
  }): TotalExpenses {
    return new TotalExpenses({
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderSingleSeries({
        dateRange,
        label: 'Expenses',
        style: { color: 'pink', thickness: 'thick' },
      }),
    });
  }

  public resolve(api: ResolveExecAPI): TotalExpenses {
    api.resolveAllExpenses();
    this.props.timeSeriesBuilder.addPoint(api.date, this.dynamicTotalExpenses);
    return new TotalExpenses({
      ...this.props,
    });
  }

  public dynamicReportExpense(amount: number): void {
    this.dynamicTotalExpenses += amount;
  }

  public override getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }

  public get resolvedValue(): number {
    return this.dynamicTotalExpenses;
  }
}
