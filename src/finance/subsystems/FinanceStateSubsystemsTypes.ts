import type CashSubsystem from './CashSubsystem';
import type { CashSubsystemStaticConfig } from './CashSubsystem';
import type JobsSubsystem from './JobsSubsystem';
import type { JobsSubsystemStaticConfig } from './JobsSubsystem';
import type MortgageSubsystem from './MortgageSubsystem';
import type { MortgageSubsystemProps } from './MortgageSubsystem';
import type UncategorizedExpensesSubsystem from './UncategorizedExpensesSubsystem';
import type { UncategorizedExpensesSubsystemProps } from './UncategorizedExpensesSubsystem';

export type FinanceSubsystemStaticConfig = {
  cash: CashSubsystemStaticConfig;
  jobs: JobsSubsystemStaticConfig;
  mortgage: MortgageSubsystemProps;
  uncategorizedExpenses: UncategorizedExpensesSubsystemProps;
};

export type FinanceSubsystemProps = {
  cash: CashSubsystem;
  jobs: JobsSubsystem;
  mortgage: MortgageSubsystem;
  uncategorizedExpenses: UncategorizedExpensesSubsystem;
};
