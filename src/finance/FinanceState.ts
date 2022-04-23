import { applyAction } from './Action';
import type { FinanceRule } from './FinanceRule';
import type { FinanceStateProps } from './FinanceStateProps';
import { shouldTriggerActivate } from './Trigger';

export default class FinanceState {
  readonly props: FinanceStateProps;

  constructor(props: FinanceStateProps) {
    this.props = props;
  }

  get cash(): number {
    return this.props.cash;
  }

  get monthlyExpenses(): number {
    return this.props.monthlyExpenses;
  }

  get monthlyIncome(): number {
    return this.props.jobs.reduce(
      (acc, { monthlyIncome }) => acc + monthlyIncome,
      0,
    );
  }

  getNextState(rules: ReadonlyArray<FinanceRule>): FinanceState {
    const cash = this.cash - this.monthlyExpenses + this.monthlyIncome;
    let nextProps: FinanceStateProps = {
      cash,
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
