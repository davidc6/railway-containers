import { NextRequest, NextResponse } from "next/server";
import { gql } from "graphql-request";
import { graphQLClient } from "../../../graphql-client";

const GET_SERVICE = gql`
    query Service($serviceId: String!) {
        service(id: $serviceId) {
            deployments(last: 1) {
                edges {
                    node {
                        id
                        status
                    }
                }
            }
            name
        }
    }
`;

export async function GET(req: NextRequest, context: any) {
    const { params } = context;
    try {
        const data = await graphQLClient.request({ document: GET_SERVICE, variables: { serviceId: params.id } });
        return NextResponse.json({ data });
    } catch (e: any) {
        console.log(e)
        return NextResponse.json({ error: e.message });
    }
}
