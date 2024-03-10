import { NextRequest, NextResponse } from "next/server";
import { gql } from "graphql-request";
import { graphQLClient } from "../../graphql-client";
import { SERVICE_TYPE } from "@/app/types";

const CREATE_NODEJS_SERVICE = gql`
  mutation createNodeJsService($id: ID!) {
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
  mutation createRedisService($id: String!, $envId: String!) {
    templateDeploy(
        input: {
            services: {
                serviceName: "Redis", 
                id: "b4020063-80a2-4cc7-966a-57227cf4a9a0", 
                template: "bitnami/redis", 
                variables: {
                    ALLOW_EMPTY_PASSWORD: "true"
                } 
            }
            projectId: $id
            environmentId: $envId,
            templateCode: "redis"
        }
    ) {
        projectId
        workflowId
    }
  }
`;

type TEMPLATE_DEPLOY = {
    projectId: string,
    workflowId: string
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    let document = CREATE_REDIS_SERVICE;
    if (body.id === SERVICE_TYPE.NODE) {
        document = CREATE_NODEJS_SERVICE;
    }

    try {
        const data: TEMPLATE_DEPLOY = await graphQLClient.request(
            {
                document,
                variables: { id: process.env.PROJECT_ID, serviceId: "", envId: process.env.ENVIRONMENT_ID }
            }
        );

        return NextResponse.json({ data }, { status: 202 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
