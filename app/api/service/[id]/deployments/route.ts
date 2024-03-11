import { NextRequest, NextResponse } from "next/server";
import { gql } from 'graphql-request';
import { graphQLClient } from '@/app/graphql-client';
import { DeploymentNode } from "@/app/api/project/[id]/route";

const DEPLOYMENTS = gql`
    query Deployments($id: String!) {
        deployments (
            input: { 
                serviceId: $id
            }
            first: 1
        ){
            edges {
                node {
                    id
                    status
                    canRedeploy
                }
            }
        }
        service(id: $id) {
            name
        }
    }
`;

const DEPLOY = gql`
    mutation ServiceInstanceRedeploy($serviceId: String!, $envId: String!) {
        serviceInstanceRedeploy(
            environmentId: $envId
            serviceId: $serviceId
        )
    }
`;

export type DeploymentsType = {
    deployments: {
        edges: DeploymentNode[]
    }
    service: {
        name: string
    }
}

// Gets deployments for a service
export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const { params } = context;

    try {
        const data: DeploymentsType = await graphQLClient.request({ document: DEPLOYMENTS, variables: { id: params.id } });
        return NextResponse.json({ data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const data = await graphQLClient.request({ document: DEPLOY, variables: { serviceId: body.id, envId: process.env.ENVIRONMENT_ID } });

        return NextResponse.json({ data }, { status: 204 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
