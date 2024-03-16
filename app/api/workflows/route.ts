import { graphQLClient } from "@/app/graphql-client";
import { gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";

const WORKFLOW = gql`
  query workflowStatus($id: String!) {
    workflowStatus(workflowId: $id) {
        status
        error
    }
}
`

export async function POST(req: NextRequest) {
    const body = await req.json()

    try {
        const data: any = await graphQLClient.request({ document: WORKFLOW, variables: { id: body.id } });

        return NextResponse.json({ data }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
