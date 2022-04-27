import type DateRange from 'src/dates/DateRange';
import type TimeSeriesTopLevelConfigBuilderSingleSeries from './builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { FinanceStateComponentObject } from './components/FinanceStateComponent';
import type { FinanceStateComponentStaticConfig } from './components/FinanceStateComponentPropsType';
import type Job from './Job';

export type FinanceStateStaticConfig = Readonly<{
  cash: number;
  components: ReadonlyArray<FinanceStateComponentStaticConfig>;
  jobs: ReadonlyArray<Job>;
  baseMonthlyExpenses: number;
}>;

export type FinanceStateProps = Omit<FinanceStateStaticConfig, 'components'> &
  Readonly<{
    components: ReadonlyArray<FinanceStateComponentObject>;
    coreBuilders: Readonly<{
      cash: TimeSeriesTopLevelConfigBuilderSingleSeries;
      expenses: TimeSeriesTopLevelConfigBuilderSingleSeries;
      income: TimeSeriesTopLevelConfigBuilderSingleSeries;
    }>;
    dateRange: DateRange;
  }>;
