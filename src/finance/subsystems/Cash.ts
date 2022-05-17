import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderMultiSeries from '../builders/TimeSeriesTopLevelConfigBuilderMultiSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { WithdrawResult } from './helpers/ResolveExecAPI';
import Subsystem from './shared/Subsystem';

export type StaticConfig = Readonly<{
  currentValue: number;
}>;

export type CashProps = Readonly<
  StaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderMultiSeries;
  }
>;

export default class Cash extends Subsystem<Cash> {
  private readonly props: CashProps;
  private dynamicValue: number;

  private constructor(props: CashProps) {
    super();
    this.props = props;
    this.dynamicValue = props.currentValue;
  }

  public static fromStaticConfig({
    cash: staticConfig,
    dateRange,
  }: Readonly<{
    cash: StaticConfig;
    dateRange: DateRange;
    extraSeries?: ReadonlyArray<string>;
  }>): Cash {
    return new Cash({
      ...staticConfig,
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderMultiSeries({
        dateRange,
        label: 'Cash',
      }),
    });
  }

  public get builder(): TimeSeriesTopLevelConfigBuilderMultiSeries {
    return this.props.timeSeriesBuilder;
  }

  public override resolveImpl(api: ResolveExecAPI): Cash {
    this.props.timeSeriesBuilder.addPointSingleSeries({
      date: api.date,
      series: 'cash',
      style: { color: 'pink', thickness: 'thick' },
      value: this.props.currentValue,
    });
    api.resolveAllIncome();
    api.resolveAllExpenses();
    api.resolveAllTransfers();
    return new Cash({
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

  dynamicWithdrawOrDepositCashForTransfer(
    withdrawAmount: number,
  ): WithdrawResult {
    const actualWithdrawAmount = Math.min(this.dynamicValue, withdrawAmount);
    this.dynamicValue -= actualWithdrawAmount;
    return {
      amountWithdrawn: actualWithdrawAmount,
      successfullyWithdrawn: true,
    };
  }

  public override getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }

  public get currentValue(): number {
    return this.props.currentValue;
  }
}
