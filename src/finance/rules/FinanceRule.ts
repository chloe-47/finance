import type { StaticConfig as ActionStaticConfig } from './Action';
import Action from './Action';
import type { Trigger } from './Trigger';

export type StaticConfig = Readonly<{
  action: ActionStaticConfig;
  trigger: Trigger;
}>;

export type Props = Readonly<{
  action: Action;
  trigger: Trigger;
}>;

export default class FinanceRule {
  private readonly props: Props;
  private constructor(props: Props) {
    this.props = props;
  }

  public static fromStaticConfig({
    action,
    trigger,
  }: StaticConfig): FinanceRule {
    return new FinanceRule({
      action: Action.fromStaticConfig(action),
      trigger,
    });
  }

  get action(): Action {
    return this.props.action;
  }

  get trigger(): Trigger {
    return this.props.trigger;
  }
}
