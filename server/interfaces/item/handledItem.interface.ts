export interface HandledItemInterface {
  id: number;
  sequence: number;
  error?: {
    key: string;
    message: string;
  };
}
