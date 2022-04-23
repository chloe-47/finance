export type FinanceStateMortgageComponentProps = Readonly<{
  apr: string;
  balance: number;
  fixedMonthlyPayment: number;
  isForeclosed?: true;
  insurancePerYear: number;
  taxPerSixMonths: number;
}>;
