export interface InsertQueryResult {
  fieldcount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

export interface SearchItem {
  name: string;
  link: string;
  img: string;
  amount: string;
  price: string;
  id: string;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
}
