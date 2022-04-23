import type { FinanceStateComponentPropsType } from './components/FinanceStateComponentPropsType';
import type Job from './Job';

export type FinanceStateProps = Readonly<{
  cash: number;
  components: ReadonlyArray<FinanceStateComponentPropsType>;
  jobs: ReadonlyArray<Job>;
  monthlyExpenses: number;
}>;
