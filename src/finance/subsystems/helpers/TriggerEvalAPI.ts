import type { Subsystems } from '../FinanceStateSubsystemsTypes';

export default class TriggerEvalAPI {
  private readonly props: Subsystems;
  public constructor(props: Subsystems) {
    this.props = props;
  }

  public get currentCashAmount(): number {
    return this.props.cash.currentValue;
  }

  public get isUnemployed(): boolean {
    return this.props.jobs.isUnemployed;
  }
}
