import type TimeSeriesTopLevelConfigBuilderMultiSeries from '../builders/TimeSeriesTopLevelConfigBuilderMultiSeries';

export type MortgageSubsystemStaticConfig = Readonly<{
  apr: string;
  balance: number;
  fixedMonthlyPayment: number;
  isForeclosed?: true;
  insurancePerYear: number;
  taxPerSixMonths: number;
}>;

export type MortgageSubsystemProps = MortgageSubsystemStaticConfig & {
  timeSeriesBuilder: TimeSeriesTopLevelConfigBuilderMultiSeries;
};

export default class MortgageSubsystem {
  private props: MortgageSubsystemStaticConfig;

  constructor(props: MortgageSubsystemStaticConfig) {
    this.props = props;
  }
}
