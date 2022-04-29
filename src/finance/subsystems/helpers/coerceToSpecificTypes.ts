import CashSubsystem from '../CashSubsystem';
import type { Subsystems } from '../FinanceStateSubsystemsTypes';
import JobsSubsystem from '../JobsSubsystem';
import MortgageSubsystem from '../MortgageSubsystem';
import type { Subsystem } from '../Subsystem';
import TotalExpensesSubsystem from '../TotalExpensesSubsystem';
import TotalIncomeSubsystem from '../TotalIncomeSubsystem';
import UncategorizedExpensesSubsystem from '../UncategorizedExpensesSubsystem';

type GenericTypes = Readonly<{
  cash: Subsystem;
  jobs: Subsystem;
  mortgage: Subsystem;
  totalExpenses: Subsystem;
  totalIncome: Subsystem;
  uncategorizedExpenses: Subsystem;
}>;

export default function coerceToSpecificTypes({
  cash,
  jobs,
  mortgage,
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
