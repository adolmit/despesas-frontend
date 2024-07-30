import { DataRecord } from 'src/app/core/models/result';

export type ExpenseTable = DataRecord & {
  selected: boolean;
};
