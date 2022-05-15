import type { TimeSeriesTopLevelConfig } from '../../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from '../helpers/ResolveExecAPI';

export interface Subsystem {
  doesReportExpenses(): boolean;
  doesReportIncome(): boolean;
  doesReportTransfer(): boolean;
  getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig>;
  resolve(args: ResolveExecAPI): Subsystem;
}
