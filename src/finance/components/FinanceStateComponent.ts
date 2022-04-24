import type DateRange from 'src/dates/DateRange';
import type { TimeSeriesTopLevelConfigBuilder } from '../builders/TimeSeriesTopLevelConfigBuilder';
import type FinanceState from '../FinanceState';
import type { FinanceStateComponentPropsType } from './FinanceStateComponentPropsType';

export type CreateBuildersArgs = Readonly<{
  dateRange: DateRange;
  state: FinanceState;
}>;

export interface FinanceStateComponentObject {
  getExpensesAmount(cash: number): number;
  getNextState(cash: number): FinanceStateComponentObject;
  asProps(): FinanceStateComponentPropsType;
  createBuilders(
    args: CreateBuildersArgs,
  ): ReadonlyArray<TimeSeriesTopLevelConfigBuilder>;
}
