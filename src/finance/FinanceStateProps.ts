import type Job from './Job';

export type FinanceStateProps = Readonly<{
  cash: number;
  jobs: ReadonlyArray<Job>;
  monthlyExpenses: number;
}>;
