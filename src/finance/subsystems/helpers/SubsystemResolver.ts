import type Date_ from 'src/dates/Date_';
import type { Subsystems } from '../FinanceStateSubsystemsTypes';
import type { Subsystem } from '../Subsystem';
import coerceToSpecificTypes from './coerceToSpecificTypes';
import ResolveExecAPI from './ResolveExecAPI';

type ResolveState =
  | 'Not Started'
  | 'In Progress'
  | Readonly<{ resolved: Subsystem }>;

type AllStates = Map<Subsystem, ResolveState>;

type Props = Readonly<{
  subsystems: Subsystems;
  date: Date_;
}>;

export default class SubsystemResolver {
  private readonly props: Props;
  private readonly resolveStates: AllStates;
  private readonly resolveExecAPI: ResolveExecAPI;

  public constructor(props: Props) {
    this.props = props;
    this.resolveStates = new Map(
      Object.values(props.subsystems).map((subsystem) => [
        subsystem,
        'Not Started',
      ]),
    );
    this.resolveExecAPI = new ResolveExecAPI({
      date: props.date,
      resolver: this,
      subsystems: props.subsystems,
    });
  }

  public get allSubsystems(): Subsystem[] {
    return Object.values(this.props.subsystems);
  }

  public resolveAll(): void {
    this.allSubsystems
      .sort((a, b) =>
        // Resolve all income sources first, then all expenses,
        // then everything else
        a.doesReportIncome() ||
        (!b.doesReportIncome() && a.doesReportExpenses())
          ? -1
          : 1,
      )
      .forEach((s) => this.resolve(s));
  }

  public resolve(subsystem: Subsystem): Subsystem {
    const state = this.resolveStates.get(subsystem);
    if (state === undefined) {
      throw new Error('State not available for subsystem');
    } else if (state === 'In Progress') {
      throw new Error('Circular subsystem resolution dependency');
    } else if (typeof state === 'object' && 'resolved' in state) {
      return state.resolved;
    } else {
      this.resolveStates.set(subsystem, 'In Progress');
      const nextState = subsystem.resolve(this.resolveExecAPI);
      this.resolveStates.set(subsystem, { resolved: nextState });
      return nextState;
    }
  }

  public getNextSubsystems(): Subsystems {
    return coerceToSpecificTypes({
      cash: this.getAssertResolved(this.props.subsystems.cash),
      jobs: this.getAssertResolved(this.props.subsystems.jobs),
      mortgage: this.getAssertResolved(this.props.subsystems.mortgage),
      totalExpenses: this.getAssertResolved(
        this.props.subsystems.totalExpenses,
      ),
      totalIncome: this.getAssertResolved(this.props.subsystems.totalIncome),
      uncategorizedExpenses: this.getAssertResolved(
        this.props.subsystems.uncategorizedExpenses,
      ),
    });
  }

  private getAssertResolved(subsystem: Subsystem): Subsystem {
    const state = this.resolveStates.get(subsystem);
    if (!(typeof state === 'object' && 'resolved' in state)) {
      throw new Error('Not resolved');
    }
    const { resolved } = state;
    return resolved;
  }
}
