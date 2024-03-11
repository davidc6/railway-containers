'use server'

import { revalidatePath } from "next/cache";
import { DEPLOYMENT_STATUS, JSONResponse, SERVICE_TYPE } from "./types";
import { DeploymentsType } from "./api/service/[id]/deployments/route";

async function pollWorkflowStatus(data: any) {
    return new Promise((res, rej) => {
        let timer_id = setInterval(async () => {
            const url = `${process.env.BASE_URL}/api/workflows`;
            const workflowsResponse = await fetch(url, { method: "POST", body: JSON.stringify({ id: data.templateDeploy.workflowId }) })

            const workflowsData = await workflowsResponse.json()

            if (workflowsData.data.workflowStatus.status === "Complete") {
                clearInterval(timer_id)
                res('Done')
            }
        }, 2000)
    })
}

export async function createService() {
    const response = await fetch(`${process.env.BASE_URL}/api/service`,
        { method: "POST", body: JSON.stringify({ id: SERVICE_TYPE.REDIS }) }
    )
    const { data }: JSONResponse<{ templateDeploy: { workflowId: string } }> = await response.json()

    const url = `${process.env.BASE_URL}/api/workflows`
    const workflowsResponse = await fetch(url,
        { method: "POST", body: JSON.stringify({ id: data?.templateDeploy?.workflowId }) }
    )
    const workflowsData = await workflowsResponse.json()

    if (workflowsData.data.workflowStatus.status !== "Complete") {
        await pollWorkflowStatus(data)
    }

    revalidatePath("/")

    return { message: "Deployment complete" }
}

const firstDeploymentStatus = (data: JSONResponse<DeploymentsType>) => {
    return data?.data?.deployments?.edges[0]?.node?.status
}

const pollDeploymentStatus = (serviceId: string) => {
    return new Promise((res, rej) => {
        let timer_id = setInterval(async () => {
            const url = `${process.env.BASE_URL}/api/service/${serviceId}/deployments`
            const response = await fetch(url)
            const serviceData = await response.json()

            const status = firstDeploymentStatus(serviceData)

            // stop polling when we hit one of the following container statuses
            if (
                status == DEPLOYMENT_STATUS.SUCCESS ||
                status == DEPLOYMENT_STATUS.REMOVED ||
                status == DEPLOYMENT_STATUS.CRASHED ||
                !status // services that have not yet been deployed
            ) {
                clearInterval(timer_id)
                return res(serviceData)
            }
        }, 3500)
    })
}

export async function triggerRedeployment(deploymentId: string, serviceId: string) {
    const response = await fetch(`${process.env.BASE_URL}/api/deployment`,
        { method: "POST", body: JSON.stringify({ id: deploymentId }) }
    )

    await response.json()

    const service = await pollDeploymentStatus(serviceId)

    revalidatePath("/")
    revalidatePath("/service/[id]", "layout")

    return { service }
}

export async function triggerContainerShutdown(deploymentId: string, serviceId: string) {
    const response = await fetch(`${process.env.BASE_URL}/api/deployment/${deploymentId}`,
        { method: "DELETE" }
    )

    await response.json()

    const service = await pollDeploymentStatus(serviceId)

    revalidatePath("/")
    revalidatePath("/service/[id]", "layout")

    return { service }
}
