'use client'

import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { DeploymentsType } from '@/app/api/service/[id]/deployments/route';
import { JSONResponse } from '@/app/types';
import { HomeLink } from '@/app/service/[id]/HomeLink';
import { Header } from '@/components/Header';
import { DEPLOYMENT_STATUS, DeploymentsList } from '@/app/service/[id]/DeploymentsList';
import { DeploymentNode } from '@/app/api/project/[id]/route';

export const BUTTON_CLASSES = 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-2 border border-gray-400 rounded shadow w-24'
const POLLING_INTERVAL = 5000;

type ListItemContextType = {
    listItemBeingProcessed: boolean,
    setListItemBeingProcessed: Dispatch<SetStateAction<boolean>>
}

export const ListItemContext = createContext<ListItemContextType>(undefined!)

export default function Page({ params }: { params: { id: string } }) {
    const [serviceDeployments, setServiceDeployments] = useState<DeploymentsType | null>(null)
    const [isLoading, setLoading] = useState(true)
    const [shouldFetch, setShouldFetch] = useState(true)
    const [rowBeingProcessed, setRowBeingProcessed] = useState<boolean>(false)

    useEffect(() => {
        if (shouldFetch || rowBeingProcessed) {
            // loader effect
            if (rowBeingProcessed) {
                processDeploymentAction()
            }

            // deployment status polling
            const intervalId = setInterval(() => {
                fetch(`/api/service/${params.id}/deployments`)
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

    const firstDeploymentStatus = (data: JSONResponse<DeploymentsType>) => {
        return data?.data?.deployments?.edges[0]?.node?.status
    }

    const pseudoNode = (): DeploymentNode => {
        return { node: { id: 'Processing', name: '', status: '', canRedeploy: true } }
    }

    // To improve user experience and communicate action to the users
    const processDeploymentAction = () => {
        if (serviceDeployments?.deployments) {
            const { deployments, service } = serviceDeployments

            const deploymentsWithPseudoDeployment: DeploymentsType = {
                service: service,
                deployments: {
                    edges: [pseudoNode(), ...deployments.edges]
                }
            }

            setServiceDeployments(deploymentsWithPseudoDeployment)
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

    const ServicesHeader = () => {
        return (
            <>
                <Header heading={serviceDeployments?.service?.name ?? ''} />
                <div className='mt-8'>
                    <Link href={`/service/${params.id}`} className='underline underline-offset-8'>Deployments</Link>
                </div>
            </>
        )
    }

    const Deployments = () => {
        return serviceDeployments && serviceDeployments?.deployments?.edges.length
            ? <ListItemContext.Provider
                value={{ listItemBeingProcessed: rowBeingProcessed, setListItemBeingProcessed: setRowBeingProcessed }}
            >
                <DeploymentsList serviceId={params.id} serviceDeployments={serviceDeployments?.deployments.edges} />
            </ListItemContext.Provider>
            : <Deploy />
    }

    const Deploy = () => {
        return (
            <div>
                <p className='mt-6'>No deployments yet</p>
                <button className={BUTTON_CLASSES} onClick={deploymentHandler}>
                    Deploy
                </button>
            </div>
        )
    }

    return (
        <>
            <HomeLink />
            {
                !isLoading
                    ? <><ServicesHeader /><Deployments /></>
                    : <p>Loading ...</p>
            }
        </>
    )
}
