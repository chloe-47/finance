import type TriggerEvalAPI from './subsystems/helpers/TriggerEvalAPI';

export type Trigger =
  | Readonly<['Cash >=', number]>
  | Readonly<['Cash <=', number]>
  | [Trigger, 'and', Trigger]
  | 'unemployed';

export type TriggerArgs = {
  cash: number;
  isUnemployed: boolean;
};

export function shouldTriggerActivate(
  trigger: Trigger,
  evalApi: TriggerEvalAPI,
): boolean {
  if (trigger.length === 2 && typeof trigger[1] === 'number') {
    const value = trigger[1];
    if (trigger[0] === 'Cash >=') {
      return evalApi.currentCashAmount >= value;
    } else if (trigger[0] === 'Cash <=') {
      return evalApi.currentCashAmount <= value;
    }
  } else if (trigger === 'unemployed') {
    return evalApi.isUnemployed;
  } else if (trigger.length === 3 && trigger[1] === 'and') {
    const first = trigger[0];
    const second = trigger[2];
    return (
      shouldTriggerActivate(first, evalApi) &&
      shouldTriggerActivate(second, evalApi)
    );
  }
  throw new Error('Unhandled trigger: ' + JSON.stringify(trigger));
}
