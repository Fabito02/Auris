import 'mysql2';

declare module 'mysql2' {
  interface Query {
    [key: number]: any;
    0: any[];
    1: any;
    [Symbol.iterator](): IterableIterator<any>;
  }
}