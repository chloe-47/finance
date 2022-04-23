import type { FinanceStateProps } from './FinanceStateProps';

export type Trigger =
  | Readonly<['Cash >=', number]>
  | Readonly<['Cash <=', number]>
  | [Trigger, 'and', Trigger]
  | 'unemployed';

export function shouldTriggerActivate(
  trigger: Trigger,
  args: FinanceStateProps,
): boolean {
  if (trigger.length === 2 && typeof trigger[1] === 'number') {
    const value = trigger[1];
    if (trigger[0] === 'Cash >=') {
      return args.cash >= value;
    } else if (trigger[0] === 'Cash <=') {
      return args.cash <= value;
    }
  } else if (trigger === 'unemployed') {
    return args.jobs.length === 0;
  } else if (trigger.length === 3 && trigger[1] === 'and') {
    const first = trigger[0];
    const second = trigger[2];
    return (
      shouldTriggerActivate(first, args) && shouldTriggerActivate(second, args)
    );
  }
  throw new Error('Unhandled trigger: ' + JSON.stringify(trigger));
}
