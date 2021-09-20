export interface insertQueryResult {
    fieldcount: number,
    affectedRows: number,
    insertId: number,
    serverStatus: number,
    warningCount: number,
    message: string,
    protocol41: boolean,
    changedRows: number
}

export interface searchItem {
    name: string,
    link: string,
    img: string,
    amount: string,
    price: string,
    id: string;
}

export interface category {
    id?: number;
    name: string;
    color: string;
}
