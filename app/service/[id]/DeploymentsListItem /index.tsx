import { MouseEvent } from "react"
import { DeploymentNode } from "@/app/api/project/[id]/route"
import { DEPLOYMENT, DEPLOYMENT_STATUS } from "@/app/types"

export const BUTTON_CLASSES = 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 border border-gray-400 rounded shadow w-24'

type Props = {
    index: number,
    isBeingProcessed: boolean,
    node: DeploymentNode,
    removeDeploymentHandler: (e: MouseEvent<HTMLButtonElement>) => void,
    redeployDeploymentHandler: (e: MouseEvent<HTMLButtonElement>) => void
}

export const DeploymentsListItem = ({ index, isBeingProcessed = false, node, redeployDeploymentHandler, removeDeploymentHandler }: Props) => {
    const deploymentItemKey = (index: number, node: DeploymentNode) => {
        return isBeingProcessed && index === 0 ? 'key-rand' : node.node.id
    }

    const deploymentItemDataAttr = (index: number, node: DeploymentNode) => {
        return isBeingProcessed && index === 0 ? 'id-rand' : node.node.id
    }

    const deploymentItemClasses = (index: number, node: DeploymentNode) => {
        let bgColour = ''

        if (index === 0 && isBeingProcessed) {
            bgColour = 'bg-slate-400'
        } else if (index === 0 && node.node.status === DEPLOYMENT_STATUS.SUCCESS) {
            bgColour = 'bg-green-950'
        } else if (index === 0 && node.node.status === DEPLOYMENT_STATUS.CRASHED) {
            bgColour = 'bg-red-950'
        } else {
            bgColour = ''
        }

        return `py-3 px-3 rounded-md border-slate-900 border sm:py-4 ${bgColour}`
    }

    const deploymentItemStatus = (index: number, node: DeploymentNode) => {
        if (isBeingProcessed && index === 0) {
            return DEPLOYMENT[DEPLOYMENT_STATUS.INITIALISING].label
        }

        const status = node.node.status;
        if (status) {
            return DEPLOYMENT[status as DEPLOYMENT_STATUS].label
        }

        return DEPLOYMENT[DEPLOYMENT_STATUS.REMOVED].label
    }

    const deploymentButton = (index: number, node: DeploymentNode) => {
        if (index !== 0) {
            return null
        }

        if (node.node.status === DEPLOYMENT_STATUS.REMOVED && node.node.canRedeploy) {
            return <button
                className={BUTTON_CLASSES}
                data-id={node.node.id}
                onClick={redeployDeploymentHandler}>
                Deploy
            </button>
        }

        if (node.node.status === DEPLOYMENT_STATUS.SUCCESS) {
            return <button
                className={BUTTON_CLASSES}
                data-id={node.node.id}
                onClick={removeDeploymentHandler}>
                Remove
            </button>
        }
    }

    return (
        <li
            key={deploymentItemKey(index, node)}
            data-id={deploymentItemDataAttr(index, node)}
            className={deploymentItemClasses(index, node)}
        >
            <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                <div className='flex-1 min-w-0'>
                    <p>
                        <span className='font-bold'>ID:</span> {node.node.id}
                    </p>
                    <p className='mt-1'>
                        <span className='font-bold'>Status:</span> {deploymentItemStatus(index, node)}
                    </p>
                </div>
                <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white'>
                    {deploymentButton(index, node)}
                </div>
            </div>
        </li>
    )
}
