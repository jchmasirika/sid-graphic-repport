export interface Collection<T> {
    totalCount: number;
    edges: { node: T, cursor: string }[]
}