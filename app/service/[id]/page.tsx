'use client'

import { Edge } from '@/app/api/project/[id]/route';
import { DeploymentsType } from '@/app/api/service/[id]/deployments/route';
import { JSONResponse } from '@/app/types';
import { firstDeploymentStatus } from '@/app/utils';
import Link from 'next/link'
import { MouseEvent, useEffect, useRef, useState } from 'react';

enum DEPLOYMENT_STATUS {
    SUCCESS = "SUCCESS",
    REMOVED = "REMOVED",
    CRASHED = "CRASHED",
    INITIALISING = "INITIALISING",
    DEPLOYING = "DEPLOYING"
}

const DEPLOYMENT = {
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

const BUTTON_CLASSES = 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 border border-gray-400 rounded shadow w-24'
const POLLING_INTERVAL = 5000;

export default function Page({ params }: { params: { id: string } }) {
    const [serviceDeployments, setServiceDeployments] = useState<DeploymentsType | null>(null)
    const [isLoading, setLoading] = useState(true)
    const [shouldFetch, setShouldFetch] = useState(true)
    const [rowBeingProcessed, setRowBeingProcessed] = useState<boolean>(false)

    useEffect(() => {
        if (shouldFetch || rowBeingProcessed) {
            const intervalId = setInterval(() => {
                fetch(`/api/service/${params.id}/deployments`)
                    .then((res: any) => res.json())
                    .then((data: JSONResponse<DeploymentsType>) => {
                        // stop polling when we hit one of the following container statuses
                        const status = firstDeploymentStatus(data)
                        if (
                            status === DEPLOYMENT_STATUS.SUCCESS ||
                            status === DEPLOYMENT_STATUS.REMOVED ||
                            status === DEPLOYMENT_STATUS.CRASHED
                        ) {
                            setServiceDeployments(data.data)
                            setLoading(false)
                            setShouldFetch(false)
                            setRowBeingProcessed(false)
                        }
                    })

            }, POLLING_INTERVAL);

            return () => clearInterval(intervalId);
        }
    }, [shouldFetch, rowBeingProcessed]);

    // To improve user experience and communicate action to the users
    const processDeploymentAction = () => {
        if (serviceDeployments?.deployments) {
            const { deployments, service } = serviceDeployments;
            const deploymentsWithPseudoDeployment: DeploymentsType = {
                service: service,
                deployments: {
                    edges: [{ node: { id: 'Processing', status: '', canRedeploy: true } }, ...deployments.edges]
                }
            }
            setServiceDeployments(deploymentsWithPseudoDeployment)
            setRowBeingProcessed(true)
        }
    }

    const removeDeploymentHandler = async (e: MouseEvent<HTMLButtonElement>) => {
        // TODO: a pop-up to confirm (i.e. "Are you sure you want to delete?")
        const id = (e.target as HTMLInputElement).getAttribute('data-id');

        try {
            processDeploymentAction()
            await fetch(`/api/deployment/${id}`, { method: "DELETE" })
        } catch (e: any) {
            console.log(e)
        }
    }

    const redeployDeploymentHandler = async (e: MouseEvent<HTMLButtonElement>) => {
        // TODO: a pop-up component to confirm redeployment
        const id = (e.target as HTMLInputElement).getAttribute("data-id");

        try {
            processDeploymentAction()
            await fetch(`/api/deployment`, { method: "POST", body: JSON.stringify({ id }) })
        } catch (e: any) {
            console.log(e)
        }
    }

    const deploymentHandler = async () => {
        try {
            processDeploymentAction()
            await fetch(`/api/service/${params.id}/deployments`, { method: "POST", body: JSON.stringify({ id: params.id }) })
        } catch (e: any) {
            console.log(e)
        }
    }

    const deploymentItemKey = (index: number, node: Edge) => {
        return rowBeingProcessed && index === 0 ? 'key-rand' : node.node.id
    }

    const deploymentItemDataAttr = (index: number, node: Edge) => {
        return rowBeingProcessed && index === 0 ? 'id-rand' : node.node.id
    }

    const deploymentItemClasses = (index: number, node: Edge) => {
        let bgColour = ''

        if (index === 0 && rowBeingProcessed) {
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

    const deploymentItemStatus = (index: number, node: Edge) => {
        if (rowBeingProcessed && index === 0) {
            return DEPLOYMENT[DEPLOYMENT_STATUS.INITIALISING].label
        }

        const status = node.node.status;
        if (status) {
            return DEPLOYMENT[status as DEPLOYMENT_STATUS].label
        }

        return DEPLOYMENT[DEPLOYMENT_STATUS.REMOVED].label
    }

    const deploymentButton = (index: number, node: any) => {
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

    if (isLoading) {
        return <p>Loading ... </p>
    }

    return <>
        <Link href={"/"}>
            <svg height="32px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="32px" stroke='currentColor' fill='currentColor'><path d="M189.3,128.4L89,233.4c-6,5.8-9,13.7-9,22.4c0,8.7,3,16.5,9,22.4l100.3,105.4c11.9,12.5,31.3,12.5,43.2,0  c11.9-12.5,11.9-32.7,0-45.2L184.4,288h217c16.9,0,30.6-14.3,30.6-32c0-17.7-13.7-32-30.6-32h-217l48.2-50.4  c11.9-12.5,11.9-32.7,0-45.2C220.6,115.9,201.3,115.9,189.3,128.4z" /></svg>
        </Link>
        <h1 className='text-3xl mt-2 font-bold'>
            <span>{serviceDeployments?.service?.name}</span>
        </h1>
        <div className='mt-8'>
            <a href="#" className='underline underline-offset-8'>Deployments</a>
        </div>
        {
            serviceDeployments && serviceDeployments?.deployments?.edges.length
                ? <ul className='divide-y divide-gray-200 dark:divide-gray-700 mt-6'>
                    {
                        serviceDeployments.deployments.edges.map((node: any, index: number) => {
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
                        })
                    }
                </ul>
                : <div><p className='mt-6'>No deployments yet </p><button
                    className={BUTTON_CLASSES}
                    onClick={deploymentHandler}>
                    Deploy
                </button></div>
        }
    </>
}
