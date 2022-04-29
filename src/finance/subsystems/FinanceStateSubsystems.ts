import CashSubsystem from './CashSubsystem';
import type { FinanceSubsystemProps } from './FinanceStateSubsystemsTypes';

export default class FinanceStateSubsystems {
  private props: FinanceSubsystemProps;

  private constructor(props: FinanceSubsystemProps) {
    this.props = props;
  }

  public static fromStaticConfig({cash, jobs, mortgage, uncategorizedExpenses} FinanceSubsystemStaticConfig): FinanceStateSubsystems {
    return new FinanceStateSubsystems({
      cash: CashSubsystem.fromStaticConfig({cashe})
      jobs
    })
  }
}
