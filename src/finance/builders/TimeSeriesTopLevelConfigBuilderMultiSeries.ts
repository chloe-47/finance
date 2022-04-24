import type DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import type { FinanceStateComponentObject } from '../components/FinanceStateComponent';
import type FinanceState from '../FinanceState';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import StaticSeriesModelBuilderMultiSeries from './StaticSeriesModelBuilderMultiSeries';
import type { TimeSeriesTopLevelConfigBuilder } from './TimeSeriesTopLevelConfigBuilder';

type Props = Readonly<{
  dateRange: DateRange;
  label: string;
  seriesLabels: ReadonlyArray<string>;
  getValues: (state: FinanceState) => ReadonlyMap<string, number>;
}>;

export default class TimeSeriesTopLevelConfigBuilderMultiSeries
  implements TimeSeriesTopLevelConfigBuilder
{
  readonly props: Props;
  readonly builder: StaticSeriesModelBuilderMultiSeries;

  constructor(props: Props) {
    this.props = props;
    this.builder = new StaticSeriesModelBuilderMultiSeries({
      dateRange: props.dateRange,
      label: props.label,
      seriesLabels: props.seriesLabels,
    });
    Object.freeze(this);
  }

  addPoint(date: Date_, state: FinanceState): void {
    Array.from(this.props.getValues(state).entries()).forEach(
      ([label, value]) => {
        this.builder.addPoint(label, { date, value });
      },
    );
  }

  getTopLevelConfig(): TimeSeriesTopLevelConfig {
    return {
      key: this.props.label,
      model: this.builder.getModel(),
    };
  }

  static forComponent<T extends FinanceStateComponentObject>({
    component,
    getValues,
    state,
    ...rest
  }: {
    component: T;
    dateRange: DateRange;
    label: string;
    getValues: (
      component: T,
      state: FinanceState,
    ) => ReadonlyMap<string, number>;
    seriesLabels: ReadonlyArray<string>;
    state: FinanceState;
  }): TimeSeriesTopLevelConfigBuilderMultiSeries {
    const index = state.components.indexOf(component);
    return new TimeSeriesTopLevelConfigBuilderMultiSeries({
      getValues: (state: FinanceState): ReadonlyMap<string, number> => {
        const component = state.components[index];
        if (component == null) {
          throw new Error('Component not found');
        }
        return getValues(component as unknown as T, state);
      },
      ...rest,
    });
  }
}
