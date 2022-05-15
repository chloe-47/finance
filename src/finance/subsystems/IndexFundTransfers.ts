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

export default class IndexFundTransfers
  extends SubsystemBase
  implements Subsystem
{
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

  public resolve(api: ResolveExecAPI): IndexFundTransfers {
    const initialCash = api.getInitialCash();
    const targetCash = api.getTargetCash();
    let indexFundDepositAmount = 0;
    if (initialCash > targetCash.max) {
      indexFundDepositAmount = initialCash - targetCash.max;
    } else if (initialCash < targetCash.min) {
      indexFundDepositAmount = initialCash - targetCash.min;
    }

    this.props.timeSeriesBuilder.addPoint(api.date, indexFundDepositAmount);
    this.resolvedValue = indexFundDepositAmount;
    return this;
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
