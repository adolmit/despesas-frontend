export interface DataResult {
  total: number;
  records: DataRecord[];
}

export interface DataRecord {
  _id: number;
  ano_movimentacao: string;
  mes_movimentacao: string;
}

export interface MovimentacoPage {
  nroPaginas: number;
  nroElementos: number;
  data: Movimentacao[];
}

export interface Item {
  id: number;
  nome: string;
}

export interface Movimentacao {
  id: number;
  ano: string;
  mes: string;
  categoria: Item;
  orgao: Item;
  modalidade: Item;
  fonte: Item;
  valor: number;
}

export interface RelatorioMes {
  relatorioMes: number;
  relatorioValor: number;
}

export interface RelatorioCategoria {
  relatorioCategoria: string;
  relatorioValor: number;
}

export interface RelatorioFonte {
  relatorioFonte: string;
  relatorioValor: number;
}
