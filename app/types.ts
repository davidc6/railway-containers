export type JSONResponse<T> = {
    data: T
}

export enum SERVICE_TYPE {
    NODE = "node",
    REDIS = "redis"
}