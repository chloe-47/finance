import type Date_ from 'src/dates/Date_';
import type FinanceState from '../FinanceState';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';

export interface TimeSeriesTopLevelConfigBuilder {
  addPoint(date: Date_, state: FinanceState): void;
  getTopLevelConfig(): TimeSeriesTopLevelConfig;
}
