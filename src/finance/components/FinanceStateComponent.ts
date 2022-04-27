import type DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import type FinanceState from '../FinanceState';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';

export type CreateBuildersArgs = Readonly<{
  dateRange: DateRange;
  state: FinanceState;
}>;

export type ResolveArgs = Readonly<{
  cash: number;
  date: Date_;
}>;

export interface FinanceStateComponentObject {
  resolve(args: ResolveArgs): void;
  get expensesAmount(): number;
  get nextState(): FinanceStateComponentObject;
  get timeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig>;
}
