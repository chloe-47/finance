import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import Subsystem from './shared/Subsystem';

export type StaticConfig = Readonly<{
  initialBalance: number;
}>;

export type Props = Readonly<{
  balance: number;
  timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
}>;

export default class IndexFundBalance extends Subsystem<IndexFundBalance> {
  private readonly props: Props;

  private constructor(props: Props) {
    super();
    this.props = props;
  }

  public static fromStaticConfig({
    dateRange,
    indexFundBalance,
  }: {
    dateRange: DateRange;
    indexFundBalance: StaticConfig;
  }): IndexFundBalance {
    return new IndexFundBalance({
      balance: indexFundBalance.initialBalance,
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderSingleSeries({
        dateRange,
        label: 'Index Fund Balance',
        style: { color: 'pink', thickness: 'thick' },
      }),
    });
  }

  public override doesReportTransfer(): boolean {
    return true;
  }

  public override resolveImpl(api: ResolveExecAPI): IndexFundBalance {
    const currentBalance = this.props.balance;
    const depositAmount = Math.max(
      api.getIndexFundDepositAmount(),
      -1 * currentBalance,
    );
    const { amountWithdrawn } =
      api.withdrawOrDepositCashForTransfer<IndexFundBalance>(
        this,
        depositAmount,
      );
    const newBalance = currentBalance + amountWithdrawn;
    // Assuming 2% YoY market growth
    const newBalanceWithMarketGrowth = newBalance * (1 + 0.02 / 12);
    this.props.timeSeriesBuilder.addPoint(api.date, currentBalance);
    return new IndexFundBalance({
      ...this.props,
      balance: newBalanceWithMarketGrowth,
    });
  }

  public override getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }
}
