import { NextRequest, NextResponse } from "next/server";
import { gql } from "graphql-request";
import { graphQLClient } from "../../../graphql-client";

const REMOVE_DEPLOYMENT = gql`
    mutation DeploymentRemove($id: String!) {
        deploymentRemove(id: $id)
    }
`;

// Deletes a deployment / spins down a container
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    const { params } = context;

    try {
        const data = await graphQLClient.request({ document: REMOVE_DEPLOYMENT, variables: { id: params.id } });

        return NextResponse.json({ data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
