import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderMultiSeries from '../builders/TimeSeriesTopLevelConfigBuilderMultiSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import Subsystem from './shared/Subsystem';

export type StaticConfig = Readonly<{
  apr: string;
  currentBalance: number;
  fixedMonthlyPayment: number;
  insurancePerYear: number;
  taxPerSixMonths: number;
}>;

export type Props = Readonly<{
  constants: Readonly<{
    insurancePerMonth: number;
    monthlyInterestRate: number;
    taxPerMonth: number;
    fixedMonthlyPayment: number;
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderMultiSeries;
  }>;
  currentBalance: number;
  isForeclosed?: true;
}>;

export default class Mortgage extends Subsystem<Mortgage> {
  private readonly props: Props;

  private constructor(props: Props) {
    super();
    this.props = props;
  }

  public static fromStaticConfig({
    dateRange,
    mortgage: staticConfig,
  }: {
    dateRange: DateRange;
    mortgage: StaticConfig;
  }): Mortgage {
    return new Mortgage({
      constants: {
        fixedMonthlyPayment: staticConfig.fixedMonthlyPayment,
        insurancePerMonth: staticConfig.insurancePerYear / 12,
        monthlyInterestRate: parseFloat(staticConfig.apr) / (100 * 12),
        taxPerMonth: staticConfig.taxPerSixMonths / 6,
        timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderMultiSeries({
          dateRange,
          label: 'Mortgage Payments',
        }),
      },
      currentBalance: staticConfig.currentBalance,
    });
  }

  public override doesReportExpenses(): boolean {
    return true;
  }

  public override resolveImpl(api: ResolveExecAPI): Mortgage {
    if (this.derivedValuesInternal) {
      throw new Error(
        'Mortgage.resolve should only be called once per instance',
      );
    }
    this.derivedValuesInternal = this.computeDerivedValues(api);
    this.props.constants.timeSeriesBuilder.addPoint({
      date: api.date,
      style: { color: 'pink', thickness: 'thick' },
      values: this.getValuesForBuilder(this.derivedValuesInternal),
    });
    return this.derivedValuesInternal.nextState;
  }

  public override getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.constants.timeSeriesBuilder.getTopLevelConfig()];
  }

  private computeDerivedValues(api: ResolveExecAPI): DerivedValues {
    const currentBalance = this.props.currentBalance;
    const fixedMonthlyPayment = this.props.constants.fixedMonthlyPayment;
    if (this.props.isForeclosed) {
      return {
        expensesAmount: 0,
        nextState: new Mortgage(this.props),
        payments: NO_PAYMENTS,
      };
    }
    const insurance = this.props.constants.insurancePerMonth;
    const tax = this.props.constants.taxPerMonth;
    const expenseAmount =
      Math.min(fixedMonthlyPayment, currentBalance) + insurance + tax;

    const { amountWithdrawn, successfullyWithdrawn } =
      api.withdrawCashForExpenseIfAvailable<Mortgage>(this, expenseAmount);

    if (!successfullyWithdrawn) {
      return {
        expensesAmount: amountWithdrawn,
        nextState: new Mortgage({
          constants: this.props.constants,
          currentBalance: this.props.currentBalance,
          isForeclosed: true,
        }),
        payments: NO_PAYMENTS,
      };
    } else {
      const interestPayment = Math.min(
        currentBalance * this.props.constants.monthlyInterestRate,
        fixedMonthlyPayment,
      );
      const principal = Math.min(
        currentBalance,
        Math.max(fixedMonthlyPayment - interestPayment, 0),
      );
      const newBalance = Math.max(currentBalance - principal, 0);
      const totalExpense = interestPayment + insurance + principal + tax;
      return {
        expensesAmount: totalExpense,
        nextState: new Mortgage({
          constants: this.props.constants,
          currentBalance: newBalance,
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

  private derivedValuesInternal: DerivedValues | undefined;
}

type DerivedValues = Readonly<{
  expensesAmount: number;
  nextState: Mortgage;
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
