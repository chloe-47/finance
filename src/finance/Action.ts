import type { FinanceStateProps } from './FinanceStateProps';
import type Job from './Job';

export type Action = Readonly<['Start job', Job] | 'Quit all jobs'>;

export function applyAction(
  action: Action,
  { jobs, ...rest }: FinanceStateProps,
): FinanceStateProps {
  if (action === 'Quit all jobs') {
    return { jobs: [], ...rest };
  } else {
    const [actionName, job] = action;
    if (actionName === 'Start job') {
      return { jobs: [...jobs, job], ...rest };
    }
  }
  throw new Error('Unhandled action: ' + JSON.stringify(action));
}
