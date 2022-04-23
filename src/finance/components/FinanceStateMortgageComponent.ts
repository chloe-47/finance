import type { FinanceStateComponentObject } from './FinanceStateComponent';
import type { FinanceStateComponentPropsType } from './FinanceStateComponentPropsType';
import type { FinanceStateMortgageComponentProps } from './FinanceStateMortgageComponentProps';

export default class FinanceStateMortgageComponent
  implements FinanceStateComponentObject
{
  readonly props: FinanceStateMortgageComponentProps;

  constructor(props: FinanceStateMortgageComponentProps) {
    this.props = props;
  }

  getExpensesAmount(cash: number): number {
    const {
      balance,
      fixedMonthlyPayment,
      isForeclosed,
      insurancePerYear,
      taxPerSixMonths,
    } = this.props;
    if (isForeclosed) {
      return 0;
    }
    const insurance = insurancePerYear / 12;
    const tax = taxPerSixMonths / 6;
    const expenseAmount =
      Math.min(fixedMonthlyPayment, balance) + insurance + tax;
    if (expenseAmount > cash) {
      return 0;
    } else {
      return expenseAmount;
    }
  }

  getNextState(cash: number): FinanceStateComponentObject {
    const {
      apr,
      balance,
      fixedMonthlyPayment,
      isForeclosed,
      insurancePerYear,
      taxPerSixMonths,
    } = this.props;
    if (isForeclosed || balance === 0) {
      return this;
    }
    const insurance = insurancePerYear / 12;
    const tax = taxPerSixMonths / 6;
    const expenseAmount =
      Math.min(fixedMonthlyPayment, balance) + insurance + tax;
    if (expenseAmount > cash) {
      return new FinanceStateMortgageComponent({
        ...this.props,
        isForeclosed: true,
      });
    } else {
      const interest = parseFloat(apr) / 100;
      const interestPayment = (balance * interest) / 12;
      const principalPayment = Math.max(
        fixedMonthlyPayment - interestPayment,
        0,
      );
      const newBalance = Math.max(balance - principalPayment, 0);
      return new FinanceStateMortgageComponent({
        ...this.props,
        balance: newBalance,
      });
    }
  }

  asProps(): FinanceStateComponentPropsType {
    return {
      ...this.props,
      type: 'Mortgage',
    };
  }
}
