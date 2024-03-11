'use server'

import { revalidatePath } from "next/cache";
import { JSONResponse, SERVICE_TYPE } from "./types";

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

export async function triggerRedeployment(deploymentId: string) {
    const response = await fetch(`${process.env.BASE_URL}/api/deployment`,
        { method: "POST", body: JSON.stringify({ id: deploymentId }) }
    )
    const { data } = await response.json()

    revalidatePath("/service/[id]", "page")
    revalidatePath("/")

    return { message: "Triggered redeployment" }
}

export async function triggerContainerShutdown(deploymentId: string) {
    const response = await fetch(`${process.env.BASE_URL}/api/deployment/${deploymentId}`,
        { method: "DELETE" }
    )
    const { data } = await response.json()

    revalidatePath("/service/[id]", "page")
    revalidatePath("/")

    return { message: "Triggered redeployment" }
}