'use client'

import { DeploymentNode } from "@/app/api/project/[id]/route"
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react"
import { BUTTON_CLASSES, DeploymentsListItem } from "../DeploymentsListItem "
import { createContext } from "react"
import { triggerContainerShutdown, triggerRedeployment } from "@/app/actions"

type ListItemContextType = {
    listItemBeingProcessed: boolean,
    setListItemBeingProcessed: Dispatch<SetStateAction<boolean>>
}

export const ListItemContext = createContext<ListItemContextType>(undefined!)

export const DeploymentsList = ({ initialDeployments, serviceId }: { initialDeployments: DeploymentNode[], serviceId: string }) => {
    const [deployments, setDeployments] = useState<DeploymentNode[]>(initialDeployments)
    const [deploymentProcessing, setDeploymentProcessing] = useState<boolean>(false)

    const pseudoNode = (): DeploymentNode => {
        return { node: { id: 'Processing', name: '', status: '', canRedeploy: true } }
    }

    // To improve user experience and communicate action to the users
    const processDeploymentAction = () => {
        if (deployments && deployments.length) {
            setDeployments([pseudoNode(), ...deployments])
        }
    }

    const removeDeploymentHandler = async (e: MouseEvent<HTMLButtonElement>) => {
        // TODO: a pop-up to confirm (i.e. "Are you sure you want to delete?")
        const id = (e.target as HTMLInputElement).getAttribute('data-id') as string;

        try {
            setDeploymentProcessing(true)
            processDeploymentAction()

            const { service }: any = await triggerContainerShutdown(id, serviceId)

            setDeploymentProcessing(false)
            setDeployments(service?.data?.deployments?.edges)
        } catch (e: any) {
            console.log(e)
        }
    }

    const redeployDeploymentHandler = async (e: MouseEvent<HTMLButtonElement>) => {
        // TODO: a pop-up to confirm redeployment
        const id = (e.target as HTMLInputElement).getAttribute("data-id") as string;

        try {
            setDeploymentProcessing(true)
            processDeploymentAction()

            const { service }: any = await triggerRedeployment(id, serviceId)

            setDeploymentProcessing(false)
            setDeployments(service?.data?.deployments?.edges)
        } catch (e: any) {
            console.log(e)
        }
    }

    const deploymentHandler = async () => {
        try {
            processDeploymentAction()
            await fetch(`/api/service/${serviceId}/deployments`, { method: "POST", body: JSON.stringify({ id: serviceId }) })
        } catch (e: any) {
            console.log(e)
        }
    }

    return (
        <ul className='divide-y divide-gray-200 dark:divide-gray-700 mt-6'>
            {
                deployments && deployments.length
                    ? deployments.map((node: DeploymentNode, index: number) => {
                        return (
                            <DeploymentsListItem
                                key={node.node.id}
                                index={index}
                                node={node}
                                isBeingProcessed={deploymentProcessing}
                                removeDeploymentHandler={removeDeploymentHandler}
                                redeployDeploymentHandler={redeployDeploymentHandler}
                            />
                        )
                    })
                    : <div>
                        <p className='mt-6'>No deployments yet</p>
                        <button className={BUTTON_CLASSES} onClick={deploymentHandler}>
                            Deploy
                        </button>
                    </div>
            }
        </ul>
    )
}