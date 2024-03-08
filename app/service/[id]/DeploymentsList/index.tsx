import { DeploymentNode } from "@/app/api/project/[id]/route"
import { Dispatch, MouseEvent, SetStateAction, useContext } from "react"
import { DeploymentsListItem } from "../DeploymentsListItem "
import { createContext } from "react"


type ListItemContextType = {
    listItemBeingProcessed: boolean,
    setListItemBeingProcessed: Dispatch<SetStateAction<boolean>>
}

export const ListItemContext = createContext<ListItemContextType>(undefined!)

export enum DEPLOYMENT_STATUS {
    SUCCESS = "SUCCESS",
    REMOVED = "REMOVED",
    CRASHED = "CRASHED",
    INITIALISING = "INITIALISING",
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

export const DeploymentsList = ({ serviceId, serviceDeployments }: { serviceId: string, serviceDeployments: DeploymentNode[] }) => {
    const { listItemBeingProcessed, setListItemBeingProcessed } = useContext(ListItemContext)

    const removeDeploymentHandler = async (e: MouseEvent<HTMLButtonElement>) => {
        // TODO: a pop-up to confirm (i.e. "Are you sure you want to delete?")
        const id = (e.target as HTMLInputElement).getAttribute('data-id');

        try {
            setListItemBeingProcessed(true)
            await fetch(`/api/deployment/${id}`, { method: "DELETE" })
        } catch (e: any) {
            console.log(e)
        }
    }

    const redeployDeploymentHandler = async (e: MouseEvent<HTMLButtonElement>) => {
        // TODO: a pop-up to confirm redeployment
        const id = (e.target as HTMLInputElement).getAttribute("data-id");

        try {
            setListItemBeingProcessed(true)
            await fetch(`/api/deployment`, { method: "POST", body: JSON.stringify({ id }) })
        } catch (e: any) {
            console.log(e)
        }
    }

    return (
        <ul className='divide-y divide-gray-200 dark:divide-gray-700 mt-6'>
            {
                serviceDeployments.map((node: DeploymentNode, index: number) => {
                    return (
                        <DeploymentsListItem
                            key={node.node.id}
                            index={index}
                            node={node}
                            isBeingProcessed={listItemBeingProcessed}
                            removeDeploymentHandler={removeDeploymentHandler}
                            redeployDeploymentHandler={redeployDeploymentHandler}
                        />
                    )
                })
            }
        </ul>
    )
}