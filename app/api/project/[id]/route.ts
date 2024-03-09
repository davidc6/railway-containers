import { gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { graphQLClient } from "../../../graphql-client";

const GET_PROJECT = gql`
  query Project($id: String!) {
    project(id: $id) {
      services {
          edges {
              node {
                  id
                  name
                  projectId
                  deployments {
                    edges {
                      node {
                        status
                      }
                    }
                  }
              }
          }
      }
    }
  }
`;

export type DeploymentNode = {
  node: {
    id: string,
    status: string,
    name: string
    canRedeploy: boolean
  }
}

export type ServiceNode = {
  node: {
    id: string,
    name: string
    projectId: string
    status: string
    deployments: {
      edges: DeploymentNode[]
    }
  }
}

export type Project = {
  project: {
    id: string,
    name: string,
    services: {
      edges: ServiceNode[]
    }
  }
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;

  try {
    const data: Project = await graphQLClient.request({ document: GET_PROJECT, variables: { id: params.id } });

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
