import type Date_ from 'src/dates/Date_';
import type { Subsystems } from '../shared/FinanceStateSubsystemsTypes';
import type Subsystem from '../shared/Subsystem';
import type { ResolvedTargetCash } from '../TargetCash';
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

  public withdrawCashForExpenseIfAvailable<T extends Subsystem<T>>(
    subsystem: T,
    expenseValue: number,
  ): WithdrawResult {
    if (!subsystem.doesReportExpenses()) {
      throw new Error(
        'Subsystem called withdrawCashForExpenseIfAvailable but returned false for doesReportExpenses',
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

  public withdrawOrDepositCashForTransfer<T extends Subsystem<T>>(
    subsystem: T,
    withdrawAmount: number,
  ): WithdrawResult {
    if (!subsystem.doesReportTransfer()) {
      throw new Error(
        'Subsystem called withdrawOrDepositCashForTransfer but returned false for doesReportTransfer',
      );
    }
    const { amountWithdrawn } =
      this.props.subsystems.cash.dynamicWithdrawOrDepositCashForTransfer(
        withdrawAmount,
      );
    return { amountWithdrawn, successfullyWithdrawn: true };
  }

  public reportIncome<T extends Subsystem<T>>(
    subsystem: T,
    incomeValue: number,
  ): void {
    if (!subsystem.doesReportIncome()) {
      throw new Error(
        'Subsystem called reportExpense but returned false for doesReportIncome',
      );
    }
    this.props.subsystems.cash.dynamicAddCash(incomeValue);
    this.props.subsystems.totalIncome.dynamicReportIncome(incomeValue);
  }

  private hasResolvedAllIncome = false;
  public resolveAllIncome(): void {
    if (this.hasResolvedAllIncome) {
      return;
    }
    this.props.resolver.allSubsystems.forEach(
      (s) => s.doesReportIncome() && s.resolve(this),
    );
    this.hasResolvedAllIncome = true;
  }

  private hasResolvedAllExpenses = false;
  public resolveAllExpenses(): void {
    if (this.hasResolvedAllExpenses) {
      return;
    }
    this.props.resolver.allSubsystems.forEach(
      (s) => s.doesReportExpenses() && s.resolve(this),
    );
    this.hasResolvedAllExpenses = true;
  }

  private hasResolvedAllTransfers = false;
  public resolveAllTransfers(): void {
    if (this.hasResolvedAllTransfers) {
      return;
    }
    this.props.resolver.allSubsystems.forEach(
      (s) => s.doesReportTransfer() && s.resolve(this),
    );
    this.hasResolvedAllTransfers = true;
  }

  public getTotalExpenses(): number {
    this.props.subsystems.totalExpenses.resolve(this);
    return this.props.subsystems.totalExpenses.resolvedValue;
  }

  public getInitialCash(): number {
    return this.props.subsystems.cash.currentValue;
  }

  public getTargetCash(): ResolvedTargetCash {
    this.props.subsystems.targetCash.resolve(this);
    return this.props.subsystems.targetCash.getResolvedValue();
  }

  public getIndexFundDepositAmount(): number {
    this.props.subsystems.indexFundTransfers.resolve(this);
    return this.props.subsystems.indexFundTransfers.getResolvedValue();
  }
}
