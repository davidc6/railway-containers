'use client';

import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import { SERVICE_TYPE } from './types';

export function ModalOptions({ shouldReload }: { shouldReload: (reload: boolean) => void }) {
    const [openModal, setOpenModal] = useState(false);

    const createService = async () => {
        try {
            await fetch("/api/service", { method: "POST", body: JSON.stringify({ id: SERVICE_TYPE.REDIS }) });
            setOpenModal(false)
            // TODO: since Subscription is not used yet, 
            // timeout is the best way to make sure that new service will show up on the services page.
            // In the future, most likely would need to check new service status (i.e. initialisation).
            setTimeout(() => {
                shouldReload(true)
            }, 3000);
        } catch (e: any) {
            console.log(e.message)
        }
    }

    return (
        <>
            <Button onClick={() => setOpenModal(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 a self-center">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </Button>
            <Modal show={openModal} onClose={() => setOpenModal(false)} className='bg-slate-950'>
                <Modal.Header className='bg-slate-600'>What would you like to do?</Modal.Header>
                <Modal.Body>
                    <div className="p-4 md:p-5 bg-slate-600">
                        <ul className="space-y-4 mb-4">
                            <li onClick={() => createService()}>
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
                </Modal.Body>
            </Modal>
        </>
    );
}
