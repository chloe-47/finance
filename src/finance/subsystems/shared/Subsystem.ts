import type { TimeSeriesTopLevelConfig } from 'src/finance/TimeSeriesTopLevelConfig';
import type ResolveExecAPI from '../helpers/ResolveExecAPI';

export default abstract class Subsystem<T extends Subsystem<T>> {
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

  protected resolvedState: 'Not Started' | 'In Progress' | T = 'Not Started';

  public resolve(api: ResolveExecAPI): T {
    const { resolvedState } = this;
    if (resolvedState === 'In Progress') {
      throw new Error('Circular subsystem resolution dependency');
    } else if (resolvedState === 'Not Started') {
      this.resolvedState = 'In Progress';
      const nextState = this.resolveImpl(api);
      if (nextState === (this as unknown)) {
        throw new Error('resolve() must return a new object');
      }
      if (nextState.resolvedState !== 'Not Started') {
        throw new Error('Next state must start in the "Not Started" state');
      }
      this.resolvedState = nextState;
      return nextState;
    } else {
      return resolvedState;
    }
  }

  protected resolveImpl(api: ResolveExecAPI): T {
    api;
    throw new Error('Not implemented');
  }
}
