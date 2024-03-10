'use client'

import { useOptimistic } from "react"
import Link from "next/link"
import { ServiceNode } from "@/app/api/project/[id]/route"
import { Modal } from "@/components/Modal"

export const ServicesList = ({ services }: { services: ServiceNode[] }) => {
    const [optimisticServices, addOptimisticService] = useOptimistic(
        services,
        (currentState: ServiceNode[], optimisticVal: ServiceNode) => [
            ...currentState,
            optimisticVal
        ]
    )

    return <>
        {optimisticServices?.map((data: ServiceNode) => {
            // Hides the web app from the list of services
            if (data.node.id === "ca86ba1b-97c6-4bc2-bcfd-0c9d10f4468c") {
                return null
            }

            return (
                <Link
                    href={`/service/${data.node.id}`}
                    className="group rounded-lg border border-gray-800 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 m-1"
                    key={data.node.id}
                >
                    <h2 className="mb-3 text-2xl font-semibold">
                        {data?.node?.name}
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        Deployed: {data?.node?.deployments?.edges[0]?.node.status ? "Yes" : "No"}
                    </p>
                </Link>
            )
        })}
        <Modal addService={addOptimisticService} />
    </>
}
