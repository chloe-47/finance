import type { FinanceStateComponentObject } from './FinanceStateComponent';
import type { FinanceStateComponentPropsType } from './FinanceStateComponentPropsType';
import FinanceStateMortgageComponent from './FinanceStateMortgageComponent';

export default function createComponentObject(
  component: FinanceStateComponentPropsType,
): FinanceStateComponentObject {
  switch (component.type) {
    case 'Mortgage':
      return new FinanceStateMortgageComponent(component);
  }
}
