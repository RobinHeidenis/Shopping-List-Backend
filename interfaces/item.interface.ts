export interface item {
    name: string,
    quantity?: string,
    url?: string,
}

export interface fullItem extends item {
    id: number,
    status: number
}

export interface itemSequence {
    id: number,
    sequence: number
}
