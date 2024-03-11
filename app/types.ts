export type JSONResponse<T> = {
    data: T
}

export enum SERVICE_TYPE {
    NODE = "node",
    REDIS = "redis"
}

export enum DEPLOYMENT_STATUS {
    SUCCESS = "SUCCESS",
    REMOVED = "REMOVED",
    CRASHED = "CRASHED",
    INITIALISING = "INITIALIZING",
    DEPLOYING = "DEPLOYING"
}

export const DEPLOYMENT = {
    [DEPLOYMENT_STATUS.SUCCESS]: {
        label: "Deployed"
    },
    [DEPLOYMENT_STATUS.REMOVED]: {
        label: "Not deployed"
    },
    [DEPLOYMENT_STATUS.CRASHED]: {
        label: "Crashed"
    },
    [DEPLOYMENT_STATUS.INITIALISING]: {
        label: "Working"
    },
    [DEPLOYMENT_STATUS.DEPLOYING]: {
        label: "Working"
    }
}
