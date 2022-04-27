import type Date_ from 'src/dates/Date_';
import flatten from 'src/utils/flatten';
import { applyAction } from './Action';
import type { FinanceRule } from './FinanceRule';
import type { FinanceStateProps } from './FinanceStateProps';
import subtractFederalIncomeTax from './subtractFederalIncomeTax';
import type { TimeSeriesTopLevelConfig } from './TimeSeriesTopLevelConfig';
import { shouldTriggerActivate } from './Trigger';

type NextStateArgs = Readonly<{
  rules: ReadonlyArray<FinanceRule>;
  date: Date_;
}>;

export default class FinanceState {
  private readonly props: FinanceStateProps;

  public constructor(props: FinanceStateProps) {
    this.props = props;
  }

  private get baseMonthlyIncome(): number {
    const preTaxIncome = this.props.jobs.reduce(
      (acc, { monthlyIncome }) => acc + monthlyIncome,
      0,
    );
    return subtractFederalIncomeTax({ monthlyIncome: preTaxIncome });
  }

  public getNextStateAndWriteDataToChartBuildersForThisDate({
    rules,
    date,
  }: NextStateArgs): FinanceState {
    const { coreBuilders } = this.props;
    coreBuilders.cash.addPoint(date, this.props.cash);

    let thisMonthsExpenses = this.props.baseMonthlyExpenses;
    const thisMonthsIncome = this.baseMonthlyIncome;

    let cash = this.props.cash - thisMonthsExpenses + thisMonthsIncome;

    const nextComponents = this.props.components.map((component) => {
      component.resolve({ cash, date });
      const expenseAmount = component.expensesAmount;
      const updatedComponent = component.nextState;
      cash -= expenseAmount;
      thisMonthsExpenses += expenseAmount;
      return updatedComponent;
    });

    coreBuilders.expenses.addPoint(date, thisMonthsExpenses);
    coreBuilders.income.addPoint(date, thisMonthsIncome);

    let nextProps: FinanceStateProps = {
      ...this.props,
      cash,
      components: nextComponents,
    };

    rules.forEach(({ action, trigger }): void => {
      if (shouldTriggerActivate(trigger, nextProps)) {
        nextProps = applyAction(action, nextProps);
      }
    });

    return new FinanceState(nextProps);
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [
      ...Object.values(this.props.coreBuilders).map((builder) =>
        builder.getTopLevelConfig(),
      ),
      ...flatten(
        this.props.components.map((component) => component.timeSeriesConfigs),
      ),
    ];
  }
}
