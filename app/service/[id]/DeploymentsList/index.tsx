'use client'

import { DeploymentNode } from "@/app/api/project/[id]/route"
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react"
import { BUTTON_CLASSES, DeploymentsListItem } from "../DeploymentsListItem "
import { createContext } from "react"
import { DeploymentsType } from "@/app/api/service/[id]/deployments/route"
import { JSONResponse } from "@/app/types"
import { triggerContainerShutdown, triggerRedeployment } from "@/app/actions"

type ListItemContextType = {
    listItemBeingProcessed: boolean,
    setListItemBeingProcessed: Dispatch<SetStateAction<boolean>>
}

export const ListItemContext = createContext<ListItemContextType>(undefined!)

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

const POLLING_INTERVAL = 5000;

export const DeploymentsList = ({ initialDeployments, serviceId }: { initialDeployments: DeploymentNode[], serviceId: string }) => {
    const [deployments, setDeployments] = useState<DeploymentNode[]>(initialDeployments)
    const [deploymentProcessing, setDeploymentProcessing] = useState<boolean>(false)

    useEffect(() => {
        if (deploymentProcessing) {
            // loader effect
            processDeploymentAction()

            // deployment status polling
            const intervalId = setInterval(() => {
                fetch(`/api/service/${serviceId}/deployments`)
                    .then((res: any) => res.json())
                    .then((data: JSONResponse<DeploymentsType>) => {
                        const status = firstDeploymentStatus(data)

                        // stop polling when we hit one of the following container statuses
                        if (
                            status === DEPLOYMENT_STATUS.SUCCESS ||
                            status === DEPLOYMENT_STATUS.REMOVED ||
                            status === DEPLOYMENT_STATUS.CRASHED ||
                            !status // services that have not yet been deployed
                        ) {
                            setDeployments(data.data.deployments.edges)
                            // setLoading(false)
                            // setShouldFetch(false)
                            setDeploymentProcessing(false)
                        }
                    })
            }, POLLING_INTERVAL);

            return () => clearInterval(intervalId);
        }
    }, [deploymentProcessing]);


    const firstDeploymentStatus = (data: JSONResponse<DeploymentsType>) => {
        return data?.data?.deployments?.edges[0]?.node?.status
    }

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
            await triggerContainerShutdown(id)
        } catch (e: any) {
            console.log(e)
        }
    }

    const redeployDeploymentHandler = async (e: MouseEvent<HTMLButtonElement>) => {
        // TODO: a pop-up to confirm redeployment
        const id = (e.target as HTMLInputElement).getAttribute("data-id") as string;

        try {
            setDeploymentProcessing(true)
            await triggerRedeployment(id)
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