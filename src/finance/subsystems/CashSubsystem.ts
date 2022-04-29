import type TimeSeriesTopLevelConfigBuilderSingleSeries from '../builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { Subsystem } from './Subsystem';

export type CashSubsystemStaticConfig = Readonly<{
  currentValue: number;
}>;

export type CashSubsystemProps = CashSubsystemStaticConfig & {
  timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderSingleSeries;
};

export default class CashSubsystem implements Subsystem {
  private props: CashSubsystemStaticConfig;

  constructor(props: CashSubsystemStaticConfig) {
    this.props = props;
  }

  doesReportExpenses(): boolean {
    return false;
  }
}
