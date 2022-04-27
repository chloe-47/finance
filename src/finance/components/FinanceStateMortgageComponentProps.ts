import type TimeSeriesTopLevelConfigBuilderMultiSeries from '../builders/TimeSeriesTopLevelConfigBuilderMultiSeries';

export type FinanceStateMortgageComponentStaticConfig = Readonly<{
  apr: string;
  balance: number;
  fixedMonthlyPayment: number;
  isForeclosed?: true;
  insurancePerYear: number;
  taxPerSixMonths: number;
}>;

export type FinanceStateMortgageComponentProps = Readonly<
  FinanceStateMortgageComponentStaticConfig & {
    timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderMultiSeries;
  }
>;
