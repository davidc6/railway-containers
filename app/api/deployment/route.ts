import { NextRequest, NextResponse } from "next/server";
import { gql } from "graphql-request";
import { graphQLClient } from "../../graphql-client";

const REDEPLOY = gql`
    mutation DeploymentRedeploy($id: String!) {
        deploymentRedeploy(id: $id) {
            id
        }
    }
`;

// Redeploys a deployment / spins up a container
export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        console.log('WHOOPA', body)
        const data = await graphQLClient.request({ document: REDEPLOY, variables: { id: body.id } });

        console.log('HELLO', data)

        return NextResponse.json({ status: 204 });
    } catch (e: any) {
        console.log('AA', e)
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
