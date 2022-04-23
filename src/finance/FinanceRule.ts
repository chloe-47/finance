import type { Action } from './Action';
import type { Trigger } from './Trigger';

export type FinanceRule = Readonly<{
  action: Action;
  trigger: Trigger;
}>;
