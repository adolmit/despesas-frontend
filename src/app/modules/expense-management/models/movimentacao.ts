import { Movimentacao } from 'src/app/core/models/result';

export type MovimentacaoTable = Movimentacao & {
  selected: boolean;
};
