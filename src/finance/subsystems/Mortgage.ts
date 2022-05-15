import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderMultiSeries from '../builders/TimeSeriesTopLevelConfigBuilderMultiSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { Subsystem } from './shared/Subsystem';
import SubsystemBase from './shared/SubsystemBase';

export type StaticConfig = Readonly<{
  apr: string;
  currentBalance: number;
  fixedMonthlyPayment: number;
  isForeclosed?: true;
  insurancePerYear: number;
  taxPerSixMonths: number;
}>;

export type Props = Readonly<
  StaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderMultiSeries;
  }
>;

export default class Mortgage extends SubsystemBase implements Subsystem {
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
      ...staticConfig,
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderMultiSeries({
        dateRange,
        label: 'Mortgage Payments',
      }),
    });
  }

  public override doesReportExpenses(): boolean {
    return true;
  }

  public resolve(api: ResolveExecAPI): Mortgage {
    if (this.derivedValuesInternal) {
      throw new Error(
        'Mortgage.resolve should only be called once per instance',
      );
    }
    this.derivedValuesInternal = this.computeDerivedValues(api);
    this.props.timeSeriesBuilder.addPoint({
      date: api.date,
      style: { color: 'pink', thickness: 'thick' },
      values: this.getValuesForBuilder(this.derivedValuesInternal),
    });
    return this.derivedValuesInternal.nextState;
  }

  public override getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    return [this.props.timeSeriesBuilder.getTopLevelConfig()];
  }

  private computeDerivedValues(api: ResolveExecAPI): DerivedValues {
    const {
      apr,
      currentBalance,
      fixedMonthlyPayment,
      isForeclosed,
      insurancePerYear,
      taxPerSixMonths,
    } = this.props;
    if (isForeclosed) {
      return {
        expensesAmount: 0,
        nextState: new Mortgage(this.props),
        payments: NO_PAYMENTS,
      };
    }
    const insurance = insurancePerYear / 12;
    const tax = taxPerSixMonths / 6;
    const expenseAmount =
      Math.min(fixedMonthlyPayment, currentBalance) + insurance + tax;

    const { amountWithdrawn, successfullyWithdrawn } =
      api.withdrawCashForExpenseIfAvailable(this, expenseAmount);

    if (!successfullyWithdrawn) {
      return {
        expensesAmount: amountWithdrawn,
        nextState: new Mortgage({
          ...this.props,
          isForeclosed: true,
        }),
        payments: NO_PAYMENTS,
      };
    } else {
      const interest = parseFloat(apr) / 100;
      const interestPayment = Math.min(
        (currentBalance * interest) / 12,
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
          ...this.props,
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
