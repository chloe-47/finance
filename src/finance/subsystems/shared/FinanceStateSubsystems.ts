import type DateRange from 'src/dates/DateRange';
import type Date_ from 'src/dates/Date_';
import flatten from 'src/utils/flatten';
import type FinanceRule from '../../FinanceRule';
import subtractFederalIncomeTax from '../../subtractFederalIncomeTax';
import type { TimeSeriesTopLevelConfig } from '../../TimeSeriesTopLevelConfig';
import { shouldTriggerActivate } from '../../Trigger';
import Cash from '../Cash';
import SubsystemsExecState from '../helpers/SubsystemsExecState';
import IndexFundBalance from '../IndexFundBalance';
import IndexFundTransfers from '../IndexFundTransfers';
import Jobs from '../Jobs';
import Mortgage from '../Mortgage';
import TargetCash from '../TargetCash';
import TotalExpenses from '../TotalExpenses';
import TotalIncome from '../TotalIncome';
import UncategorizedExpenses from '../UncategorizedExpenses';
import type {
  FinanceSubsystemStaticConfig,
  Subsystems,
} from './FinanceStateSubsystemsTypes';
import type { Subsystem } from './Subsystem';

export default class FinanceStateSubsystems {
  private readonly props: Subsystems;

  private constructor(props: Subsystems) {
    this.props = props;
  }

  public static fromStaticConfig({
    staticConfig: {
      cash,
      jobs,
      indexFundBalance,
      mortgage,
      targetCash,
      uncategorizedExpenses,
    },
    dateRange,
  }: {
    readonly staticConfig: FinanceSubsystemStaticConfig;
    readonly dateRange: DateRange;
  }): FinanceStateSubsystems {
    const cashSubsystem = Cash.fromStaticConfig({
      cash,
      dateRange,
    });
    return new FinanceStateSubsystems({
      cash: cashSubsystem,
      indexFundBalance: IndexFundBalance.fromStaticConfig({
        dateRange,
        indexFundBalance,
      }),
      indexFundTransfers: IndexFundTransfers.fromStaticConfig({ dateRange }),
      jobs: Jobs.fromStaticConfig(jobs),
      mortgage: Mortgage.fromStaticConfig({ dateRange, mortgage }),
      targetCash: TargetCash.fromStaticConfig({
        cashBuilder: cashSubsystem.builder,
        targetCash,
      }),
      totalExpenses: TotalExpenses.fromStaticConfig({ dateRange }),
      totalIncome: TotalIncome.fromStaticConfig({ dateRange }),
      uncategorizedExpenses: UncategorizedExpenses.fromStaticConfig({
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
