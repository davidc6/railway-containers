import Link from 'next/link';
import { HomeLink } from '@/app/service/[id]/HomeLink';
import { Header } from '@/components/Header';
import { DeploymentsList } from '@/app/service/[id]/DeploymentsList';

export default async function Page({ params }: { params: { id: string } }) {
    const response: any = await fetch(`${process.env.BASE_URL}/api/service/${params.id}/deployments`)
    const { data } = await response.json()

    const ServicesHeader = () => {
        return (
            <>
                <Header heading={data?.service?.name ?? ''} />
                <div className='mt-8'>
                    <Link href={`/service/${params.id}`} className='underline underline-offset-8'>Deployments</Link>
                </div>
            </>
        )
    }

    return (
        <>
            <HomeLink />
            <ServicesHeader />
            <DeploymentsList initialDeployments={data?.deployments?.edges ?? []} serviceId={params.id} />
        </>
    )
}
