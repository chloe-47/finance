import { applyAction } from './Action';
import createComponentObject from './components/createComponentObject';
import type { FinanceStateComponentObject } from './components/FinanceStateComponent';
import type { FinanceRule } from './FinanceRule';
import type { FinanceStateProps } from './FinanceStateProps';
import subtractFederalIncomeTax from './subtractFederalIncomeTax';
import { shouldTriggerActivate } from './Trigger';

export default class FinanceState {
  readonly props: FinanceStateProps;
  readonly components: ReadonlyArray<FinanceStateComponentObject>;

  constructor(props: FinanceStateProps) {
    this.props = props;
    this.components = props.components.map(createComponentObject);
  }

  get cash(): number {
    return this.props.cash;
  }

  get monthlyExpenses(): number {
    let thisMonthsExpenses = this.props.monthlyExpenses;
    let nextCash = this.props.cash - thisMonthsExpenses + this.monthlyIncome;
    this.components.forEach((component): void => {
      const expenseAmount = component.getExpensesAmount(nextCash);
      nextCash -= expenseAmount;
      thisMonthsExpenses += expenseAmount;
    });
    return thisMonthsExpenses;
  }

  get monthlyIncome(): number {
    const preTaxIncome = this.props.jobs.reduce(
      (acc, { monthlyIncome }) => acc + monthlyIncome,
      0,
    );
    return subtractFederalIncomeTax({ monthlyIncome: preTaxIncome });
  }

  getNextState(rules: ReadonlyArray<FinanceRule>): FinanceState {
    let thisMonthsExpenses = this.props.monthlyExpenses;
    let nextCash = this.props.cash - thisMonthsExpenses + this.monthlyIncome;
    const nextComponents = this.components.map((component) => {
      const expenseAmount = component.getExpensesAmount(nextCash);
      const updatedComponent = component.getNextState(nextCash);
      nextCash -= expenseAmount;
      thisMonthsExpenses += expenseAmount;
      return updatedComponent.asProps();
    });

    let nextProps: FinanceStateProps = {
      cash: nextCash,
      components: nextComponents,
      jobs: this.props.jobs,
      monthlyExpenses: this.props.monthlyExpenses,
    };

    rules.forEach(({ action, trigger }): void => {
      if (shouldTriggerActivate(trigger, nextProps)) {
        nextProps = applyAction(action, nextProps);
      }
    });

    return new FinanceState(nextProps);
  }
}
