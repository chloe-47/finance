import type { TimeSeriesTopLevelConfig } from 'src/finance/TimeSeriesTopLevelConfig';

export default abstract class SubsystemBase {
  doesReportExpenses(): boolean {
    return false;
  }
  doesReportIncome(): boolean {
    return false;
  }
  doesReportTransfer(): boolean {
    return false;
  }
  getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [];
  }
}
