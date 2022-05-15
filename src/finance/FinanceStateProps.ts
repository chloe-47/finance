import type DateRange from 'src/dates/DateRange';
import type FinanceStateSubsystems from './subsystems/shared/FinanceStateSubsystems';
import type { FinanceSubsystemStaticConfig } from './subsystems/shared/FinanceStateSubsystemsTypes';

export type FinanceStateStaticConfig = Readonly<{
  subsystems: FinanceSubsystemStaticConfig;
}>;

export type FinanceStateProps = Readonly<{
  dateRange: DateRange;
  subsystems: FinanceStateSubsystems;
}>;
