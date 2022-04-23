import type { TimeSeriesModel } from 'src/time_series/models/TimeSeriesModel';

export type TimeSeriesTopLevelConfig = Readonly<{
  model: TimeSeriesModel;
  key: string;
}>;
