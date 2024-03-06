import { NextRequest, NextResponse } from "next/server";
import { gql } from 'graphql-request';
import { graphQLClient } from '../../../../graphql-client';

export const DEPLOYMENTS = gql`
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

// environmentId - production
const DEPLOY = gql`
    mutation ServiceInstanceRedeploy($serviceId: String!) {
        serviceInstanceRedeploy(
            environmentId: "42b7c860-b50d-478a-844f-f5fe0d725021"
            serviceId: $serviceId
        )
    }
`;

type NodeType = {
    node: {
        id: string,
        status: string,
        canRedeploy: boolean
    }
}

export type DeploymentsType = {
    deployments: {
        edges: NodeType[]
    }
    service: {
        name: string
    }
}

// Gets deployments for a service
export async function GET(req: NextRequest, context: any) {
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
        const data = await graphQLClient.request({ document: DEPLOY, variables: { serviceId: body.id } });

        return NextResponse.json({ data }, { status: 204 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}