import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderMultiSeries from '../builders/TimeSeriesTopLevelConfigBuilderMultiSeries';
import type { FinanceStateComponentObject } from './FinanceStateComponent';
import type { FinanceStateComponentStaticConfig } from './FinanceStateComponentPropsType';
import FinanceStateMortgageComponent from './FinanceStateMortgageComponent';

type Args = {
  component: FinanceStateComponentStaticConfig;
  dateRange: DateRange;
};

export default function createComponentObject({
  component,
  dateRange,
}: Args): FinanceStateComponentObject {
  switch (component.type) {
    case 'Mortgage':
      return new FinanceStateMortgageComponent({
        ...component,
        timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderMultiSeries({
          dateRange,
          label: 'Mortgage Payments',
          seriesLabels: ['Interest', 'Principal', 'Insurance', 'Tax', 'Total'],
        }),
      });
  }
}
