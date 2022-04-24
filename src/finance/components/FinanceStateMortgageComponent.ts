import type { TimeSeriesTopLevelConfigBuilder } from '../builders/TimeSeriesTopLevelConfigBuilder';
import TimeSeriesTopLevelConfigBuilderMultiSeries from '../builders/TimeSeriesTopLevelConfigBuilderMultiSeries';
import type FinanceState from '../FinanceState';
import type {
  CreateBuildersArgs,
  FinanceStateComponentObject,
} from './FinanceStateComponent';
import type { FinanceStateComponentPropsType } from './FinanceStateComponentPropsType';
import type { FinanceStateMortgageComponentProps } from './FinanceStateMortgageComponentProps';

type DerivedValues = Readonly<{
  expensesAmount: number;
  nextState: FinanceStateComponentObject;
  payments: Readonly<{
    insurance: number;
    interest: number;
    principal: number;
    tax: number;
    total: number;
  }>;
}>;

const NO_PAYMENTS: DerivedValues['payments'] = {
  insurance: 0,
  interest: 0,
  principal: 0,
  tax: 0,
  total: 0,
};

export default class FinanceStateMortgageComponent
  implements FinanceStateComponentObject
{
  readonly props: FinanceStateMortgageComponentProps;

  constructor(props: FinanceStateMortgageComponentProps) {
    this.props = props;
  }

  computeDerivedValues(cash: number): DerivedValues {
    const {
      apr,
      balance,
      fixedMonthlyPayment,
      isForeclosed,
      insurancePerYear,
      taxPerSixMonths,
    } = this.props;
    if (isForeclosed) {
      return { expensesAmount: 0, nextState: this, payments: NO_PAYMENTS };
    }
    const insurance = insurancePerYear / 12;
    const tax = taxPerSixMonths / 6;
    const expenseAmount =
      Math.min(fixedMonthlyPayment, balance) + insurance + tax;
    if (expenseAmount > cash) {
      return {
        expensesAmount: 0,
        nextState: new FinanceStateMortgageComponent({
          ...this.props,
          isForeclosed: true,
        }),
        payments: NO_PAYMENTS,
      };
    } else {
      const interest = parseFloat(apr) / 100;
      const interestPayment = (balance * interest) / 12;
      const principal = Math.min(
        balance,
        Math.max(fixedMonthlyPayment - interestPayment, 0),
      );
      const newBalance = Math.max(balance - principal, 0);
      const totalExpense = interestPayment + insurance + principal + tax;
      return {
        expensesAmount: totalExpense,
        nextState: new FinanceStateMortgageComponent({
          ...this.props,
          balance: newBalance,
        }),
        payments: {
          insurance,
          interest: interestPayment,
          principal,
          tax,
          total: totalExpense,
        },
      };
    }
  }

  getExpensesAmount(cash: number): number {
    return this.computeDerivedValues(cash).expensesAmount;
  }

  getNextState(cash: number): FinanceStateComponentObject {
    return this.computeDerivedValues(cash).nextState;
  }

  asProps(): FinanceStateComponentPropsType {
    return {
      ...this.props,
      type: 'Mortgage',
    };
  }

  createBuilders({
    dateRange,
    state,
  }: CreateBuildersArgs): ReadonlyArray<TimeSeriesTopLevelConfigBuilder> {
    return [
      TimeSeriesTopLevelConfigBuilderMultiSeries.forComponent<FinanceStateMortgageComponent>(
        {
          component: this,
          dateRange,
          getValues: (
            component: FinanceStateMortgageComponent,
            state: FinanceState,
          ): ReadonlyMap<string, number> => {
            return component.getValuesForBuilder(state.cash);
          },
          label: 'Mortgage Payments',
          seriesLabels: ['Interest', 'Principal', 'Insurance', 'Tax', 'Total'],
          state,
        },
      ),
    ];
  }

  getValuesForBuilder(cash: number): ReadonlyMap<string, number> {
    const { payments } = this.computeDerivedValues(cash);
    return new Map([
      ['Interest', payments.interest],
      ['Principal', payments.principal],
      ['Insurance', payments.insurance],
      ['Tax', payments.tax],
      ['Total', payments.total],
    ]);
  }
}
