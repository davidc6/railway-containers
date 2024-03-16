'use client';

import { Modal as FlowBiteModal } from 'flowbite-react';
import { useState } from 'react';
import { createService } from '@/app/actions';
import { ServiceNode } from '@/app/api/project/[id]/route';

export function Modal({ addService }: { addService: (service: ServiceNode) => void }) {
    const [openModal, setOpenModal] = useState(false);

    const optimisticNode = (): ServiceNode => {
        return { node: { id: 'newservice', name: 'New Service', projectId: '', status: '', deployments: { edges: [] } } }
    }

    return (
        <>
            <button onClick={() => setOpenModal(true)} className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 m-1 border border-pale-gray bg-gray-800/40'>
                <div className='mb-3'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 m-auto block">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                <p>Add a Service</p>
            </button>
            <FlowBiteModal show={openModal} onClose={() => setOpenModal(false)} className='bg-slate-950'>
                <FlowBiteModal.Header className='bg-slate-600'>What would you like to do?</FlowBiteModal.Header>
                <FlowBiteModal.Body>
                    <div className="p-4 md:p-5 bg-slate-600">
                        <ul className="space-y-4 mb-4">
                            <li onClick={async () => {
                                setOpenModal(false)
                                addService(optimisticNode())
                                await createService()
                            }}>
                                <input type="radio" id="job-1" name="job" value="job-1" className="hidden peer" required />
                                <label className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">Create a service</div>
                                        <div className="w-full text-gray-500 dark:text-gray-400">Redis</div>
                                    </div>
                                    <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" /></svg>
                                </label>
                            </li>
                        </ul>
                    </div>
                </FlowBiteModal.Body>
            </FlowBiteModal>
        </>
    );
}
