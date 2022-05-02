import type Date_ from 'src/dates/Date_';
import type { Props } from 'src/finance/builders/StaticSeriesModelBuilder';
import StaticSeriesModelBuilder from 'src/finance/builders/StaticSeriesModelBuilder';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type { TimeSeriesTopLevelConfigBuilder } from './TimeSeriesTopLevelConfigBuilder';

export default class TimeSeriesTopLevelConfigBuilderSingleSeries
  implements TimeSeriesTopLevelConfigBuilder
{
  readonly props: Props;
  readonly builder: StaticSeriesModelBuilder;

  constructor(props: Props) {
    this.props = props;
    this.builder = new StaticSeriesModelBuilder(props);
    Object.freeze(this);
  }

  addPoint(date: Date_, value: number): void {
    this.builder.addPoint({ date, value });
  }

  getTopLevelConfig(): TimeSeriesTopLevelConfig {
    return {
      key: this.props.label,
      model: this.builder.getModel(),
    };
  }
}
