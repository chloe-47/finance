import type { FinanceStateMortgageComponentStaticConfig } from './FinanceStateMortgageComponentProps';

export type FinanceStateComponentStaticConfig = Readonly<
  FinanceStateMortgageComponentStaticConfig & {
    type: 'Mortgage';
  }
>;
