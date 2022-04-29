import type { JobStaticConfig } from '../Job';
import type { Subsystem } from './Subsystem';

export type JobsSubsystemStaticConfig = Readonly<{
  currentJobs: ReadonlyArray<JobStaticConfig>;
}>;

export default class JobsSubsystem implements Subsystem {
  private props: JobsSubsystemStaticConfig;

  constructor(props: JobsSubsystemStaticConfig) {
    this.props = props;
  }

  doesReportExpenses(): boolean {
    return false;
  }
}
