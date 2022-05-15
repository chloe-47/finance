import type { JobStaticConfig } from '../Job';
import Job from '../Job';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { Subsystem } from './shared/Subsystem';
import SubsystemBase from './shared/SubsystemBase';

export type StaticConfig = Readonly<{
  currentJobs: ReadonlyArray<JobStaticConfig>;
}>;

export type Props = Readonly<{
  currentJobs: ReadonlyArray<Job>;
}>;

export default class Jobs extends SubsystemBase implements Subsystem {
  private readonly props: Props;
  private readonly dynamicNextJobs: Array<Job>;

  private constructor(props: Props) {
    super();
    this.props = props;
    this.dynamicNextJobs = [...props.currentJobs];
  }

  public static fromStaticConfig({ currentJobs }: StaticConfig): Jobs {
    return new Jobs({
      currentJobs: currentJobs.map((staticConfig) => new Job(staticConfig)),
    });
  }

  public override doesReportIncome(): boolean {
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
    return new Jobs({
      currentJobs: this.dynamicNextJobs,
    });
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
