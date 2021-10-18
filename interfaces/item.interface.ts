export interface Item {
  name: string;
  quantity?: string;
  url?: string;
}

export interface FullItem extends Item {
  id: number;
  status: number;
}

export interface ItemSequence {
  id: number;
  sequence: number;
}
