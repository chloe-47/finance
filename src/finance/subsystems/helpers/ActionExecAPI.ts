import type Job from 'src/finance/Job';
import type { Subsystems } from '../FinanceStateSubsystemsTypes';

export default class ActionExecAPI {
  private props: Subsystems;
  public constructor(props: Subsystems) {
    this.props = props;
  }

  public quitAllJobs(): void {
    this.props.jobs.quitAllJobs();
  }

  public startJob(job: Job): void {
    this.props.jobs.startJob(job);
  }
}
