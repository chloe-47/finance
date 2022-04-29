import type Date_ from 'src/dates/Date_';
import type { Subsystems } from '../FinanceStateSubsystemsTypes';
import type { Subsystem } from '../Subsystem';
import type SubsystemResolver from './SubsystemResolver';

export type WithdrawResult = Readonly<{
  amountWithdrawn: number;
  successfullyWithdrawn: boolean;
}>;

type Props = Readonly<{
  date: Date_;
  resolver: SubsystemResolver;
  subsystems: Subsystems;
}>;

export default class ResolveExecAPI {
  private props: Props;
  public constructor(props: Props) {
    this.props = props;
  }

  get date(): Date_ {
    return this.props.date;
  }

  public withdrawCashForExpenseIfAvailable(
    subsystem: Subsystem,
    expenseValue: number,
  ): WithdrawResult {
    if (!subsystem.doesReportExpenses()) {
      throw new Error(
        'Subsystem called reportExpense but returned false for doesReportExpenses',
      );
    }
    const { amountWithdrawn, successfullyWithdrawn } =
      this.props.subsystems.cash.dynamicWithdrawCashForExpenseIfAvailable(
        expenseValue,
      );
    if (successfullyWithdrawn) {
      this.props.subsystems.totalExpenses.dynamicReportExpense(expenseValue);
    }
    return { amountWithdrawn, successfullyWithdrawn };
  }

  public reportIncome(subsystem: Subsystem, incomeValue: number): void {
    if (!subsystem.doesReportIncome()) {
      throw new Error(
        'Subsystem called reportExpense but returned false for doesReportIncome',
      );
    }
    this.props.subsystems.cash.dynamicAddCash(incomeValue);
    this.props.subsystems.totalIncome.dynamicReportIncome(incomeValue);
  }

  public resolveAllIncome(): void {
    this.props.resolver.allSubsystems
      .filter((s) => s.doesReportIncome())
      .map((s) => this.props.resolver.resolve(s));
  }

  public resolveAllExpenses(): void {
    this.props.resolver.allSubsystems
      .filter((s) => s.doesReportExpenses())
      .map((s) => this.props.resolver.resolve(s));
  }
}
