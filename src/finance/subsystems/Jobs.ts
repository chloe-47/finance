import type { JobStaticConfig } from '../Job';
import Job from '../Job';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import Subsystem from './shared/Subsystem';

export type StaticConfig = Readonly<{
  currentJobs: ReadonlyArray<JobStaticConfig>;
}>;

export type Props = Readonly<{
  currentJobs: ReadonlyArray<Job>;
}>;

export default class Jobs extends Subsystem<Jobs> {
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

  public override resolveImpl(api: ResolveExecAPI): Jobs {
    api.reportIncome<Jobs>(this, this.getTotalIncome());
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
