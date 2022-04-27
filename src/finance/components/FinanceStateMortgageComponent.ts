import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type {
  FinanceStateComponentObject,
  ResolveArgs,
} from './FinanceStateComponent';
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
  private readonly props: FinanceStateMortgageComponentProps;

  public constructor(props: FinanceStateMortgageComponentProps) {
    this.props = props;
  }

  private derivedValuesInternal: DerivedValues | undefined;

  public resolve({ date, cash }: ResolveArgs): void {
    if (this.derivedValuesInternal) {
      throw new Error(
        'FinanceStateMortgageComponent.resolve should only be called once per instance',
      );
    }
    this.derivedValuesInternal = this._computeDerivedValues(cash);
    this.props.timeSeriesBuilder.addPoint(
      date,
      this.getValuesForBuilder(this.derivedValuesInternal),
    );
  }

  public get derivedValues(): DerivedValues {
    if (this.derivedValuesInternal === undefined) {
      throw new Error(
        'Cannot access FinanceStateMortgageComponent.derivedValues before calling .resolve()',
      );
    }
    return this.derivedValuesInternal;
  }

  private _computeDerivedValues(cash: number): DerivedValues {
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

  public get expensesAmount(): number {
    return this.derivedValues.expensesAmount;
  }

  public get nextState(): FinanceStateComponentObject {
    return this.derivedValues.nextState;
  }

  private getValuesForBuilder(
    derivedValues: DerivedValues,
  ): ReadonlyMap<string, number> {
    const { payments } = derivedValues;
    return new Map([
      ['Interest', payments.interest],
      ['Principal', payments.principal],
      ['Insurance', payments.insurance],
      ['Tax', payments.tax],
      ['Total', payments.total],
    ]);
  }

  public get timeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }
}
