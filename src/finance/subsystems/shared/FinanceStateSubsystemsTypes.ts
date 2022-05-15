import type CashSubsystem from '../Cash';
import type { StaticConfig as CashSubsystemStaticConfig } from '../Cash';
import type IndexFundBalance from '../IndexFundBalance';
import type { StaticConfig as IndexFundBalanceStaticConfig } from '../IndexFundBalance';
import type IndexFundTransfers from '../IndexFundTransfers';
import type JobsSubsystem from '../Jobs';
import type { StaticConfig as JobsSubsystemStaticConfig } from '../Jobs';
import type MortgageSubsystem from '../Mortgage';
import type { StaticConfig as MortgageSubsystemStaticConfig } from '../Mortgage';
import type TargetCash from '../TargetCash';
import type { StaticConfig as TargetCashStaticConfig } from '../TargetCash';
import type TotalExpensesSubsystem from '../TotalExpenses';
import type TotalIncomeSubsystem from '../TotalIncome';
import type UncategorizedExpensesSubsystem from '../UncategorizedExpenses';
import type { StaticConfig as UncategorizedExpensesSubsystemStaticConfig } from '../UncategorizedExpenses';

export type FinanceSubsystemStaticConfig = Readonly<{
  cash: CashSubsystemStaticConfig;
  jobs: JobsSubsystemStaticConfig;
  indexFundBalance: IndexFundBalanceStaticConfig;
  mortgage: MortgageSubsystemStaticConfig;
  targetCash: TargetCashStaticConfig;
  uncategorizedExpenses: UncategorizedExpensesSubsystemStaticConfig;
}>;

export type Subsystems = Readonly<{
  cash: CashSubsystem;
  indexFundBalance: IndexFundBalance;
  indexFundTransfers: IndexFundTransfers;
  jobs: JobsSubsystem;
  mortgage: MortgageSubsystem;
  targetCash: TargetCash;
  totalExpenses: TotalExpensesSubsystem;
  totalIncome: TotalIncomeSubsystem;
  uncategorizedExpenses: UncategorizedExpensesSubsystem;
}>;
