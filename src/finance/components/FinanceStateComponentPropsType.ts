import type { FinanceStateMortgageComponentProps } from './FinanceStateMortgageComponentProps';

export type FinanceStateComponentPropsType = Readonly<
  FinanceStateMortgageComponentProps & {
    type: 'Mortgage';
  }
>;
