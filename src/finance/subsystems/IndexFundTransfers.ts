import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import Subsystem from './shared/Subsystem';

export type StaticConfig = Readonly<Record<never, never>>;

export type Props = Readonly<
  StaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
  }
>;

export default class IndexFundTransfers extends Subsystem<IndexFundTransfers> {
  private readonly props: Props;
  private resolvedValue: number | undefined;

  private constructor(props: Props) {
    super();
    this.props = props;
  }

  public static fromStaticConfig({
    dateRange,
  }: {
    dateRange: DateRange;
  }): IndexFundTransfers {
    return new IndexFundTransfers({
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderSingleSeries({
        dateRange,
        label: 'Index Fund Deposits',
        style: { color: 'pink', thickness: 'thick' },
      }),
    });
  }

  public override resolveImpl(api: ResolveExecAPI): IndexFundTransfers {
    const initialCash = api.getInitialCash();
    const targetCash = api.getTargetCash();
    let indexFundDepositAmount = 0;
    if (initialCash > targetCash.max) {
      indexFundDepositAmount = initialCash - targetCash.max;
    } else if (initialCash < targetCash.min) {
      indexFundDepositAmount = Math.max(
        api.getIndexFundInitialBalance() * -1,
        initialCash - targetCash.min,
      );
    }

    this.props.timeSeriesBuilder.addPoint(api.date, indexFundDepositAmount);
    this.resolvedValue = indexFundDepositAmount;
    return new IndexFundTransfers(this.props);
  }

  public override getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }

  public getResolvedValue(): number {
    const { resolvedValue } = this;
    if (resolvedValue === undefined) {
      throw new Error(
        'Must call IndexFundTransfers.resolve() before IndexFundTransfers.getResolvedValue()',
      );
    }
    return resolvedValue;
  }
}
