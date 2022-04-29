import type DateRange from 'src/dates/DateRange';
import type FinanceStateSubsystems from './subsystems/FinanceStateSubsystems';
import type { FinanceSubsystemStaticConfig } from './subsystems/FinanceStateSubsystemsTypes';

export type FinanceStateStaticConfig = Readonly<{
  subsystems: FinanceSubsystemStaticConfig;
}>;

export type FinanceStateProps = Readonly<{
  dateRange: DateRange;
  subsystems: FinanceStateSubsystems;
}>;
