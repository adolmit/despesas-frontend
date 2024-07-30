export interface DataResult {
  total: number;
  records: DataRecord[];
}

export interface DataRecord {
  _id: number;
  ano_movimentacao: string;
  mes_movimentacao: string;
}
