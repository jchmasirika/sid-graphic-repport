export interface Collection<T> {
    totalCount: number;
    edges: { node: T, cursor: string }[]
}

export interface QueryData<T> {
    [name: string]: Collection<T>
}
