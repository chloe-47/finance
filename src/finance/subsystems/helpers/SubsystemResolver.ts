import type Date_ from 'src/dates/Date_';
import type { Subsystems } from '../shared/FinanceStateSubsystemsTypes';
import type { SubsystemAny } from '../shared/Subsystem';
import ResolveExecAPI from './ResolveExecAPI';

type Props = Readonly<{
  subsystems: Subsystems;
  date: Date_;
}>;

export default class SubsystemResolver {
  private readonly props: Props;
  private readonly resolveExecAPI: ResolveExecAPI;
  public readonly allSubsystems: ReadonlyArray<SubsystemAny>;

  public constructor(props: Props) {
    this.props = props;
    this.allSubsystems = Object.values(this.props.subsystems);
    this.resolveExecAPI = new ResolveExecAPI({
      date: props.date,
      resolver: this,
      subsystems: props.subsystems,
    });
  }

  public getNextSubsystems(): Subsystems {
    return {
      cash: this.props.subsystems.cash.resolve(this.resolveExecAPI),
      indexFundBalance: this.props.subsystems.indexFundBalance.resolve(
        this.resolveExecAPI,
      ),
      indexFundTransfers: this.props.subsystems.indexFundTransfers.resolve(
        this.resolveExecAPI,
      ),
      jobs: this.props.subsystems.jobs.resolve(this.resolveExecAPI),
      mortgage: this.props.subsystems.mortgage.resolve(this.resolveExecAPI),
      targetCash: this.props.subsystems.targetCash.resolve(this.resolveExecAPI),
      totalExpenses: this.props.subsystems.totalExpenses.resolve(
        this.resolveExecAPI,
      ),
      totalIncome: this.props.subsystems.totalIncome.resolve(
        this.resolveExecAPI,
      ),
      uncategorizedExpenses:
        this.props.subsystems.uncategorizedExpenses.resolve(
          this.resolveExecAPI,
        ),
    };
  }
}
