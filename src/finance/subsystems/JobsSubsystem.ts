import type { JobStaticConfig } from '../Job';
import Job from '../Job';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { Subsystem } from './Subsystem';

export type StaticConfig = Readonly<{
  currentJobs: ReadonlyArray<JobStaticConfig>;
}>;

export type Props = Readonly<{
  currentJobs: ReadonlyArray<Job>;
}>;

export default class JobsSubsystem implements Subsystem {
  private readonly props: Props;
  private readonly dynamicNextJobs: Array<Job>;

  private constructor(props: Props) {
    this.props = props;
    this.dynamicNextJobs = [...props.currentJobs];
  }

  public static fromStaticConfig({ currentJobs }: StaticConfig): JobsSubsystem {
    return new JobsSubsystem({
      currentJobs: currentJobs.map((staticConfig) => new Job(staticConfig)),
    });
  }

  public doesReportExpenses(): boolean {
    return false;
  }

  public doesReportIncome(): boolean {
    return true;
  }

  public getTotalIncome(): number {
    return this.dynamicNextJobs.reduce(
      (acc, { monthlyIncome }) => acc + monthlyIncome,
      0,
    );
  }

  public resolve(api: ResolveExecAPI): Subsystem {
    api.reportIncome(this, this.getTotalIncome());
    return new JobsSubsystem({
      currentJobs: this.dynamicNextJobs,
    });
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [];
  }

  public get isUnemployed(): boolean {
    return this.props.currentJobs.length === 0;
  }

  public quitAllJobs(): void {
    this.dynamicNextJobs.splice(0, Infinity);
  }

  public startJob(job: Job): void {
    this.dynamicNextJobs.push(job);
  }
}
