declare module 'react-native-sqlite-storage' {
  export interface ResultSet {
    rows: {
      length: number;
      item: (index: number) => any;
    };
    rowsAffected: number;
    insertId?: number;
  }

  export interface Transaction {
    executeSql(
      sqlStatement: string,
      args?: any[],
      callback?: (tx: Transaction, result: ResultSet) => void,
      errorCallback?: (error: any) => void,
    ): void;
  }

  export interface Database {
    transaction(
      callback: (tx: Transaction) => void,
      errorCallback?: (error: any) => void,
      successCallback?: () => void,
    ): void;
    executeSql(
      sqlStatement: string,
      args?: any[],
      callback?: (tx: Transaction, result: ResultSet) => void,
      errorCallback?: (error: any) => void,
    ): void;
    close(): void;
  }

  export function openDatabase(
    params: { name: string; location: string },
    success?: () => void,
    error?: (err: any) => void,
  ): Database;
}

declare module 'react-native-push-notification';
