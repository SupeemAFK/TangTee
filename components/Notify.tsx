import React, { useEffect } from 'react';
import { motion } from 'framer-motion'
import Link from 'next/link'
import IJoin from '../interface/join'

export interface INotifyProps {
    joins: IJoin[]
    setOpenNotify: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Notify ({ joins, setOpenNotify }: INotifyProps) {
    
    function close() {
        setOpenNotify(false);
    }

    return (
        <>
        <motion.div
            initial={{ y: -20, opacity: 0}}
            animate={{ y: 0, opacity: 1 }}
            className="border-[1px] border-[#e6e6e6] bg-white text-black top-0 fixed mt-16 right-1 z-30"
        >
            <div className="p-2">
                <h1 className="text-xl">Notifications</h1>
                <div className="p-[0.01rem] bg-[#e6e6e6] my-2"></div> 
                {joins.length > 0 ? (
                    <div>
                        {joins.map(join => (
                            <Link key={join.id} href={`/manage/${join.post.id}`}>
                                <div onClick={close}className="flex mt-2 p-2 items-center cursor-pointer rounded border-[1px] border-[#e6e6e6] hover:border-teal-400 w-96">
                                    <div className='w-10 h-10 rounded-full overflow-hidden'>
                                        <img className="w-full object-cover" src={join.from_user.avatar} alt={join.from_user.name} />
                                    </div>
                                    <div className="ml-2 flex-1">
                                        <h1 className="font-medium">{join.from_user.name} <span className='font-normal'>want to join your <span className="font-medium">{join.post.title}</span> party</span></h1>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <h1>Don't have anything here</h1>
                )}
            </div>
        </motion.div>
        <div 
            onClick={close} 
            className="w-full h-screen fixed top-0 left-0 z-20"
        >
        </div> 
        </>
  );
}
