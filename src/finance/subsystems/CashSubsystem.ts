import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { WithdrawResult } from './helpers/ResolveExecAPI';
import type { Subsystem } from './Subsystem';

export type StaticConfig = Readonly<{
  currentValue: number;
}>;

export type CashSubsystemProps = Readonly<
  StaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
  }
>;

export default class CashSubsystem implements Subsystem {
  private readonly props: CashSubsystemProps;
  private dynamicValue: number;

  private constructor(props: CashSubsystemProps) {
    this.props = props;
    this.dynamicValue = props.currentValue;
  }

  public static fromStaticConfig({
    cash: staticConfig,
    dateRange,
  }: {
    cash: StaticConfig;
    dateRange: DateRange;
  }): CashSubsystem {
    return new CashSubsystem({
      ...staticConfig,
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderSingleSeries({
        dateRange,
        label: 'Cash',
      }),
    });
  }

  public doesReportExpenses(): boolean {
    return false;
  }

  public doesReportIncome(): boolean {
    return false;
  }

  public resolve(api: ResolveExecAPI): CashSubsystem {
    this.props.timeSeriesBuilder.addPoint(api.date, this.props.currentValue);
    api.resolveAllIncome();
    api.resolveAllExpenses();
    return new CashSubsystem({
      ...this.props,
      currentValue: this.dynamicValue,
    });
  }

  dynamicAddCash(amount: number): void {
    this.dynamicValue += amount;
  }

  dynamicWithdrawCashForExpenseIfAvailable(amount: number): WithdrawResult {
    if (amount > this.dynamicValue) {
      return { amountWithdrawn: 0, successfullyWithdrawn: false };
    }
    this.dynamicValue -= amount;
    return { amountWithdrawn: amount, successfullyWithdrawn: true };
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }

  public get currentValue(): number {
    return this.props.currentValue;
  }
}
