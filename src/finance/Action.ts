import type { JobStaticConfig } from './Job';
import Job from './Job';
import type ActionExecAPI from './subsystems/helpers/ActionExecAPI';

export type StaticConfig = Readonly<
  ['Start job', JobStaticConfig] | 'Quit all jobs'
>;

export type Props = Readonly<['Start job', Job] | 'Quit all jobs'>;

export default class Action {
  private readonly props: Props;
  private constructor(props: Props) {
    this.props = props;
  }

  public static fromStaticConfig(staticConfig: StaticConfig): Action {
    if (staticConfig === 'Quit all jobs') {
      return new Action('Quit all jobs');
    } else {
      const [actionName, jobStaticConfig] = staticConfig;
      return new Action([actionName, Job.fromStaticConfig(jobStaticConfig)]);
    }
  }

  public exec(api: ActionExecAPI): void {
    if (this.props === 'Quit all jobs') {
      return api.quitAllJobs();
    } else {
      const [actionName, job] = this.props;
      if (actionName === 'Start job') {
        return api.startJob(job);
      }
    }
    throw new Error('Unhandled action: ' + JSON.stringify(this.props));
  }
}
