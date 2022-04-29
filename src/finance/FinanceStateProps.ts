import type DateRange from 'src/dates/DateRange';
import type TimeSeriesTopLevelConfigBuilderSingleSeries from './builders/TimeSeriesTopLevelConfigBuilderSingleSeries';
import type { FinanceStateComponentStaticConfig } from './components/FinanceStateComponentPropsType';
import type FinanceStateSubsystems from './subsystems/FinanceStateSubsystems';

export type FinanceStateStaticConfig = Readonly<{
  components: ReadonlyArray<FinanceStateComponentStaticConfig>;
}>;

export type FinanceStateProps = Omit<FinanceStateStaticConfig, 'components'> &
  Readonly<{
    subsystems: FinanceStateSubsystems;
    coreBuilders: Readonly<{
      cash: TimeSeriesTopLevelConfigBuilderSingleSeries;
      expenses: TimeSeriesTopLevelConfigBuilderSingleSeries;
      income: TimeSeriesTopLevelConfigBuilderSingleSeries;
    }>;
    dateRange: DateRange;
  }>;
