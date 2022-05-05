import type DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import flatten from 'src/utils/flatten';
import type FinanceRule from '../FinanceRule';
import subtractFederalIncomeTax from '../subtractFederalIncomeTax';
import type { TimeSeriesTopLevelConfig } from '../TimeSeriesTopLevelConfig';
import { shouldTriggerActivate } from '../Trigger';
import CashSubsystem from './CashSubsystem';
import type {
  FinanceSubsystemStaticConfig,
  Subsystems,
} from './FinanceStateSubsystemsTypes';
import SubsystemsExecState from './helpers/SubsystemsExecState';
import IndexFundTransfers from './IndexFundTransfers';
import JobsSubsystem from './JobsSubsystem';
import MortgageSubsystem from './MortgageSubsystem';
import type { Subsystem } from './Subsystem';
import TargetCash from './TargetCash';
import TotalExpensesSubsystem from './TotalExpensesSubsystem';
import TotalIncomeSubsystem from './TotalIncomeSubsystem';
import UncategorizedExpensesSubsystem from './UncategorizedExpensesSubsystem';

export default class FinanceStateSubsystems {
  private readonly props: Subsystems;

  private constructor(props: Subsystems) {
    this.props = props;
  }

  public static fromStaticConfig({
    staticConfig: { cash, jobs, mortgage, targetCash, uncategorizedExpenses },
    dateRange,
  }: {
    readonly staticConfig: FinanceSubsystemStaticConfig;
    readonly dateRange: DateRange;
  }): FinanceStateSubsystems {
    const cashSubsystem = CashSubsystem.fromStaticConfig({
      cash,
      dateRange,
    });
    return new FinanceStateSubsystems({
      cash: cashSubsystem,
      indexFundTransfers: IndexFundTransfers.fromStaticConfig({ dateRange }),
      jobs: JobsSubsystem.fromStaticConfig(jobs),
      mortgage: MortgageSubsystem.fromStaticConfig({ dateRange, mortgage }),
      targetCash: TargetCash.fromStaticConfig({
        cashBuilder: cashSubsystem.builder,
        targetCash,
      }),
      totalExpenses: TotalExpensesSubsystem.fromStaticConfig({ dateRange }),
      totalIncome: TotalIncomeSubsystem.fromStaticConfig({ dateRange }),
      uncategorizedExpenses: UncategorizedExpensesSubsystem.fromStaticConfig({
        dateRange,
        uncategorizedExpenses,
      }),
    });
  }

  public get thisMonthsIncome(): number {
    const preTaxIncome = this.props.jobs.getTotalIncome();
    return subtractFederalIncomeTax({ monthlyIncome: preTaxIncome });
  }

  public getNextStateAndWriteDataToChartBuildersForThisDate({
    rules,
    date,
  }: Readonly<{
    readonly rules: ReadonlyArray<FinanceRule>;
    readonly date: Date_;
  }>): FinanceStateSubsystems {
    const state = new SubsystemsExecState({
      date,
      subsystems: this.props,
    });

    rules.forEach(({ action, trigger }) => {
      if (shouldTriggerActivate(trigger, state.triggerEvalApi)) {
        action.exec(state.actionExecApi);
      }
    });

    state.resolver.resolveAll();
    return new FinanceStateSubsystems(state.resolver.getNextSubsystems());
  }

  public getTimeSeriesConfigs(): ReadonlyArray<TimeSeriesTopLevelConfig> {
    const allSubsystems: Subsystem[] = Object.values(this.props);
    return flatten(
      allSubsystems.map((subsystem) => subsystem.getTimeSeriesConfigs()),
    );
  }
}
