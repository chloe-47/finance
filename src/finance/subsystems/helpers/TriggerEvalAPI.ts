import type { Subsystems } from '../shared/FinanceStateSubsystemsTypes';

export default class TriggerEvalAPI {
  private readonly props: Subsystems;
  public constructor(props: Subsystems) {
    this.props = props;
  }

  public get liquidAssets(): number {
    return (
      this.props.cash.currentValue + this.props.indexFundBalance.currentValue
    );
  }

  public get isUnemployed(): boolean {
    return this.props.jobs.isUnemployed;
  }
}
