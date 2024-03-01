'use client'

import Link from "next/link";
import { ModalOptions } from "./Modal";
import { useEffect, useState } from "react";
import { Edge, Project } from "./api/project/[id]/route";
import { JSONResponse } from "./types";

export default function Home() {
  const [data, setData] = useState<Project | null>(null);
  const [reload, setReload] = useState<boolean>(false);

  // TODO: reload the page after service creation
  // most likely would need to check new service status (i.e. initialisation)
  useEffect(() => {
    async function fetchProject() {
      // Project id here does not really matter at this point
      // since project id is currently read from the environment
      let response = await fetch("/api/project/1")
      const { data }: JSONResponse<Project> = await response.json();

      if (data) {
        setData(data)
      }
    }

    fetchProject()
  }, [reload]);

  return (
    <>
      <div className="flex">
        <h1 className="text-3xl font-bold mr-2">Services</h1>
        <ModalOptions shouldReload={setReload} />
      </div>
      {
        data
          ? <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left mt-6">
            {
              data.project.services.edges.map((data: Edge) => {
                return (
                  <Link
                    href={`/service/${data.node.id}`}
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    key={data.node.id}
                  >
                    <h2 className="mb-3 text-2xl font-semibold">
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                      Deployed: {data.node.deployments.edges[0].node.status ? "Yes" : "No"}
                    </p>
                  </Link>
                )
              })
            }
          </div >
          : <p>Loading ...</p>
      }
    </>
  );
}
