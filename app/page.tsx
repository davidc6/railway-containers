import { Project } from "@/app/api/project/[id]/route";
import { JSONResponse } from "@/app/types";
import { Header } from "@/components/Header";
import { ServicesList } from "@/components/ServicesList";

export default async function Home() {
    let url = `${process.env.BASE_URL}/api/project/${process.env.PROJECT_ID}`
    let response = await fetch(url)
    const { data }: JSONResponse<Project> = await response.json()

    return (
        <>
            <div className="flex">
                <Header heading="Services" />
            </div>
            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left mt-6">
                <ServicesList services={data?.project.services.edges} />
            </div >
        </>
    )
}
