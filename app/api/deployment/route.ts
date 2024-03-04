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
        const data = await graphQLClient.request({ document: REDEPLOY, variables: { id: body.id } });

        return NextResponse.json({ data }, { status: 204 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
