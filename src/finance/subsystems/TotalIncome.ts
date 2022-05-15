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

export default class TotalIncome extends SubsystemBase implements Subsystem {
  private readonly props: Props;
  private dynamicTotalIncome: number;

  private constructor(props: Props) {
    super();
    this.props = props;
    this.dynamicTotalIncome = 0;
  }

  public static fromStaticConfig({
    dateRange,
  }: {
    dateRange: DateRange;
  }): TotalIncome {
    return new TotalIncome({
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderSingleSeries({
        dateRange,
        label: 'Income',
        style: { color: 'pink', thickness: 'thick' },
      }),
    });
  }

  public resolve(api: ResolveExecAPI): TotalIncome {
    api.resolveAllIncome();
    this.props.timeSeriesBuilder.addPoint(api.date, this.dynamicTotalIncome);
    return new TotalIncome({
      ...this.props,
    });
  }

  dynamicReportIncome(amount: number): void {
    this.dynamicTotalIncome += amount;
  }

  public override getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }
}
