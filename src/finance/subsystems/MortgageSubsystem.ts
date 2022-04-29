import type DateRange from 'src/dates/DateRange';
import TimeSeriesTopLevelConfigBuilderMultiSeries from '../builders/TimeSeriesTopLevelConfigBuilderMultiSeries';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import type ResolveExecAPI from './helpers/ResolveExecAPI';
import type { Subsystem } from './Subsystem';

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

export default class MortgageSubsystem implements Subsystem {
  private readonly props: Props;

  private constructor(props: Props) {
    this.props = props;
  }

  public static fromStaticConfig({
    dateRange,
    mortgage: staticConfig,
  }: {
    dateRange: DateRange;
    mortgage: StaticConfig;
  }): MortgageSubsystem {
    return new MortgageSubsystem({
      ...staticConfig,
      timeSeriesBuilder: new TimeSeriesTopLevelConfigBuilderMultiSeries({
        dateRange,
        label: 'Mortgage Payments',
        seriesLabels: ['Interest', 'Principal', 'Insurance', 'Tax', 'Total'],
      }),
    });
  }

  public doesReportExpenses(): boolean {
    return true;
  }

  public doesReportIncome(): boolean {
    return false;
  }

  public resolve(api: ResolveExecAPI): MortgageSubsystem {
    if (this.derivedValuesInternal) {
      throw new Error(
        'MortgageSubsystem.resolve should only be called once per instance',
      );
    }
    this.derivedValuesInternal = this.computeDerivedValues(api);
    this.props.timeSeriesBuilder.addPoint(
      api.date,
      this.getValuesForBuilder(this.derivedValuesInternal),
    );
    return this.derivedValuesInternal.nextState;
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
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
        nextState: new MortgageSubsystem(this.props),
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
        nextState: new MortgageSubsystem({
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
        nextState: new MortgageSubsystem({
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
  nextState: MortgageSubsystem;
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
