import CashSubsystem from '../Cash';
import IndexFundBalance from '../IndexFundBalance';
import IndexFundTransfers from '../IndexFundTransfers';
import Jobs from '../Jobs';
import Mortgage from '../Mortgage';
import type { Subsystems } from '../shared/FinanceStateSubsystemsTypes';
import type { Subsystem } from '../shared/Subsystem';
import TargetCash from '../TargetCash';
import TotalExpenses from '../TotalExpenses';
import TotalIncome from '../TotalIncome';
import UncategorizedExpenses from '../UncategorizedExpenses';

type GenericTypes = Readonly<{
  cash: Subsystem;
  indexFundBalance: Subsystem;
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
  indexFundBalance,
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
    indexFundBalance: (() => {
      const nextState = indexFundBalance;
      if (!(nextState instanceof IndexFundBalance)) {
        throw new Error(
          'IndexFundBalance.resolve() must return IndexFundBalance',
        );
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
      if (!(nextState instanceof Jobs)) {
        throw new Error('Jobs.resolve() must return Jobs');
      }
      return nextState;
    })(),
    mortgage: (() => {
      const nextState = mortgage;
      if (!(nextState instanceof Mortgage)) {
        throw new Error('Mortgage.resolve() must return Mortgage');
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
      if (!(nextState instanceof TotalExpenses)) {
        throw new Error('TotalExpenses.resolve() must return TotalExpenses');
      }
      return nextState;
    })(),
    totalIncome: (() => {
      const nextState = totalIncome;
      if (!(nextState instanceof TotalIncome)) {
        throw new Error('TotalIncome.resolve() must return TotalIncome');
      }
      return nextState;
    })(),
    uncategorizedExpenses: (() => {
      const nextState = uncategorizedExpenses;
      if (!(nextState instanceof UncategorizedExpenses)) {
        throw new Error(
          'UncategorizedExpenses.resolve() must return UncategorizedExpenses',
        );
      }
      return nextState;
    })(),
  };
}
