import type Date_ from 'src/dates/Date_';
import type { Subsystems } from '../shared/FinanceStateSubsystemsTypes';
import ActionExecAPI from './ActionExecAPI';
import SubsystemResolver from './SubsystemResolver';
import TriggerEvalAPI from './TriggerEvalAPI';

type Props = Readonly<{
  subsystems: Subsystems;
  date: Date_;
}>;

export default class SubsystemsExecState {
  public readonly triggerEvalApi: TriggerEvalAPI;
  public readonly actionExecApi: ActionExecAPI;
  public readonly resolver: SubsystemResolver;

  constructor({ subsystems, date }: Props) {
    this.triggerEvalApi = new TriggerEvalAPI(subsystems);
    this.actionExecApi = new ActionExecAPI(subsystems);
    this.resolver = new SubsystemResolver({
      date,
      subsystems,
    });
  }
}
