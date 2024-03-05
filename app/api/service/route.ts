import { NextRequest, NextResponse } from "next/server";
import { gql } from "graphql-request";
import { graphQLClient } from "../../graphql-client";

export enum SERVICE_TYPE {
    NODE = "node",
    REDIS = "redis"
}

const CREATE_NODEJS_SERVICE = gql`
  mutation MyMutation($id: ID!) {
    templateDeploy(
        input: {
            services: { serviceName: "hello-world", template: "Node.js" }
            projectId: $id
        }
    ) {
        projectId
    }
  }
`;

const CREATE_REDIS_SERVICE = gql`
  mutation MyMutation($id: String!) {
    templateDeploy(
        input: {
            services: { serviceName: "redis-1234", template: "redis" }
            projectId: $id
        }
    ) {
        projectId
    }
  }
`;
export async function POST(req: NextRequest) {
    const body = await req.json();

    let document = CREATE_REDIS_SERVICE;
    if (body.id === SERVICE_TYPE.NODE) {
        document = CREATE_NODEJS_SERVICE;
    }

    try {
        const data = await graphQLClient.request({ document, variables: { id: process.env.PROJECT_ID } });
        return NextResponse.json({ data }, { status: 202 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
