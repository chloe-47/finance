import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';

export interface TimeSeriesTopLevelConfigBuilder {
  getTopLevelConfig(): TimeSeriesTopLevelConfig;
}
