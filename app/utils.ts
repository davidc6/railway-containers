import { DeploymentsType } from "./api/service/[id]/deployments/route"
import { JSONResponse } from "./types"

export const firstDeploymentStatus = (data: JSONResponse<DeploymentsType>) => {
    return data?.data?.deployments?.edges[0]?.node?.status
}
