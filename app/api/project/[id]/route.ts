
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

export type Edge = {
  node: {
    id: string,
    name: string
    projectId: string
    status: string
    deployments: {
      edges: [{
        node: {
          status: string
          name: string
        }
      }]
    }
  }
};

export type Project = {
  project: {
    id: string,
    name: string,
    services: {
      edges: Edge[]
    }
  }
}

// Gets a project and its services
export async function GET(req: NextRequest, context: { id: string }) {
  // NOTE: we could use this in the future if we choose to support more than one project
  const { id } = context;

  try {
    const data: Project = await graphQLClient.request({ document: GET_PROJECT, variables: { id: process.env.PROJECT_ID } });

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
