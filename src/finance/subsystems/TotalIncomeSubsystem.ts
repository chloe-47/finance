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

export default class TotalIncomeSubsystem implements Subsystem {
  private readonly props: Props;
  private dynamicTotalIncome: number;

  private constructor(props: Props) {
    this.props = props;
    this.dynamicTotalIncome = 0;
  }

  public static fromStaticConfig({
    dateRange,
  }: {
    dateRange: DateRange;
  }): TotalIncomeSubsystem {
    return new TotalIncomeSubsystem({
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderSingleSeries({
        dateRange,
        label: 'Income',
      }),
    });
  }

  public doesReportExpenses(): boolean {
    return false;
  }

  public doesReportIncome(): boolean {
    return false;
  }

  public resolve(api: ResolveExecAPI): TotalIncomeSubsystem {
    api.resolveAllIncome();
    this.props.timeSeriesBuilder.addPoint(api.date, this.dynamicTotalIncome);
    return new TotalIncomeSubsystem({
      ...this.props,
    });
  }

  dynamicReportIncome(amount: number): void {
    this.dynamicTotalIncome += amount;
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }
}
