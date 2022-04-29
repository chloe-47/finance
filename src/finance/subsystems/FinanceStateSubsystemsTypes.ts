import type CashSubsystem from './CashSubsystem';
import type { StaticConfig as CashSubsystemStaticConfig } from './CashSubsystem';
import type JobsSubsystem from './JobsSubsystem';
import type { StaticConfig as JobsSubsystemStaticConfig } from './JobsSubsystem';
import type MortgageSubsystem from './MortgageSubsystem';
import type { StaticConfig as MortgageSubsystemStaticConfig } from './MortgageSubsystem';
import type TotalExpensesSubsystem from './TotalExpensesSubsystem';
import type TotalIncomeSubsystem from './TotalIncomeSubsystem';
import type UncategorizedExpensesSubsystem from './UncategorizedExpensesSubsystem';
import type { StaticConfig as UncategorizedExpensesSubsystemStaticConfig } from './UncategorizedExpensesSubsystem';

export type FinanceSubsystemStaticConfig = Readonly<{
  cash: CashSubsystemStaticConfig;
  jobs: JobsSubsystemStaticConfig;
  mortgage: MortgageSubsystemStaticConfig;
  uncategorizedExpenses: UncategorizedExpensesSubsystemStaticConfig;
}>;

export type Subsystems = Readonly<{
  cash: CashSubsystem;
  jobs: JobsSubsystem;
  mortgage: MortgageSubsystem;
  totalExpenses: TotalExpensesSubsystem;
  totalIncome: TotalIncomeSubsystem;
  uncategorizedExpenses: UncategorizedExpensesSubsystem;
}>;
