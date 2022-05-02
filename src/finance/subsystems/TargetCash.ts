import type TimeSeriesTopLevelConfigBuilderMultiSeries from '../builders/TimeSeriesTopLevelConfigBuilderMultiSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { Subsystem } from './Subsystem';

export type StaticConfig = Readonly<{
  min: [number, 'years of expenses'];
  max: [number, 'years of expenses'];
}>;

export type ResolvedConfig = {
  minMonthsOfExpenses: number;
  maxMonthsOfExpenses: number;
};

export type Props = Readonly<
  ResolvedConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderMultiSeries;
  }
>;

export type CreationArgs = Readonly<{
  targetCash: StaticConfig;
  cashBuilder: TimeSeriesTopLevelConfigBuilderMultiSeries;
}>;

export default class TargetCash implements Subsystem {
  private readonly props: Props;

  private constructor(props: Props) {
    this.props = props;
  }

  public static fromStaticConfig({
    targetCash: staticConfig,
    cashBuilder: timeSeriesBuilder,
  }: CreationArgs): TargetCash {
    const minYears: number = staticConfig.min[0];
    const maxYears: number = staticConfig.max[0];
    const resolvedConfig = {
      maxMonthsOfExpenses: maxYears * 12,
      minMonthsOfExpenses: minYears * 12,
    };
    return new TargetCash({
      ...resolvedConfig,
      timeSeriesBuilder,
    });
  }

  public doesReportExpenses(): boolean {
    return false;
  }

  public doesReportIncome(): boolean {
    return false;
  }

  public resolve(api: ResolveExecAPI): TargetCash {
    const totalExpenses = api.getTotalExpenses();
    const minCash = totalExpenses * this.props.minMonthsOfExpenses;
    const maxCash = totalExpenses * this.props.maxMonthsOfExpenses;
    const values = { max: maxCash, min: minCash };
    const keys: Array<'min' | 'max'> = ['min', 'max'];
    keys.forEach((key) => {
      this.props.timeSeriesBuilder.addPointSingleSeries({
        date: api.date,
        series: key,
        style: { color: 'gray', thickness: 'thin' },
        value: values[key],
      });
    });
    return new TargetCash({
      ...this.props,
    });
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [];
  }
}