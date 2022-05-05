import CashSubsystem from '../CashSubsystem';
import type { Subsystems } from '../FinanceStateSubsystemsTypes';
import IndexFundTransfers from '../IndexFundTransfers';
import JobsSubsystem from '../JobsSubsystem';
import MortgageSubsystem from '../MortgageSubsystem';
import type { Subsystem } from '../Subsystem';
import TargetCash from '../TargetCash';
import TotalExpensesSubsystem from '../TotalExpensesSubsystem';
import TotalIncomeSubsystem from '../TotalIncomeSubsystem';
import UncategorizedExpensesSubsystem from '../UncategorizedExpensesSubsystem';

type GenericTypes = Readonly<{
  cash: Subsystem;
  indexFundTransfers: Subsystem;
  jobs: Subsystem;
  mortgage: Subsystem;
  targetCash: Subsystem;
  totalExpenses: Subsystem;
  totalIncome: Subsystem;
  uncategorizedExpenses: Subsystem;
}>;

export default function coerceToSpecificTypes({
  cash,
  indexFundTransfers,
  jobs,
  mortgage,
  targetCash,
  totalExpenses,
  totalIncome,
  uncategorizedExpenses,
}: GenericTypes): Subsystems {
  return {
    cash: (() => {
      const nextState = cash;
      if (!(nextState instanceof CashSubsystem)) {
        throw new Error('CashSubsystem.resolve() must return CashSubsystem');
      }
      return nextState;
    })(),
    indexFundTransfers: (() => {
      const nextState = indexFundTransfers;
      if (!(nextState instanceof IndexFundTransfers)) {
        throw new Error(
          'IndexFundTransfers.resolve() must return IndexFundTransfers',
        );
      }
      return nextState;
    })(),
    jobs: (() => {
      const nextState = jobs;
      if (!(nextState instanceof JobsSubsystem)) {
        throw new Error('JobsSubsystem.resolve() must return JobsSubsystem');
      }
      return nextState;
    })(),
    mortgage: (() => {
      const nextState = mortgage;
      if (!(nextState instanceof MortgageSubsystem)) {
        throw new Error(
          'MortgageSubsystem.resolve() must return MortgageSubsystem',
        );
      }
      return nextState;
    })(),
    targetCash: (() => {
      const nextState = targetCash;
      if (!(nextState instanceof TargetCash)) {
        throw new Error('TargetCash.resolve() must return TargetCash');
      }
      return nextState;
    })(),
    totalExpenses: (() => {
      const nextState = totalExpenses;
      if (!(nextState instanceof TotalExpensesSubsystem)) {
        throw new Error(
          'TotalExpensesSubsystem.resolve() must return TotalExpensesSubsystem',
        );
      }
      return nextState;
    })(),
    totalIncome: (() => {
      const nextState = totalIncome;
      if (!(nextState instanceof TotalIncomeSubsystem)) {
        throw new Error(
          'TotalIncomeSubsystem.resolve() must return TotalIncomeSubsystem',
        );
      }
      return nextState;
    })(),
    uncategorizedExpenses: (() => {
      const nextState = uncategorizedExpenses;
      if (!(nextState instanceof UncategorizedExpensesSubsystem)) {
        throw new Error(
          'UncategorizedExpensesSubsystem.resolve() must return UncategorizedExpensesSubsystem',
        );
      }
      return nextState;
    })(),
  };
}
