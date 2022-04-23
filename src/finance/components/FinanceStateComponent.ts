import type { FinanceStateComponentPropsType } from './FinanceStateComponentPropsType';

export interface FinanceStateComponentObject {
  getExpensesAmount(cash: number): number;
  getNextState(cash: number): FinanceStateComponentObject;
  asProps(): FinanceStateComponentPropsType;
}
