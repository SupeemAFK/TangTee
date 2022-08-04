import React, { useEffect } from 'react';
import { motion } from 'framer-motion'
import Link from 'next/link'
import IJoin from '../interface/join'

export interface INotifyProps {
    joins: IJoin[]
}

export default function Notify ({ joins }: INotifyProps) {
  return (
    <motion.div
        initial={{ y: -20, opacity: 0}}
        animate={{ y: 0, opacity: 1 }}
        className="border-[1px] border-[#e6e6e6] bg-white text-black top-0 fixed mt-16 right-1"
    >
        <div className="p-2">
            <h1 className="text-xl">Notifications</h1>
            <div className="p-[0.01rem] bg-[#e6e6e6] my-2"></div> 
            {joins.length > 0 ? (
                <div>
                    {joins.map(join => (
                        <Link key={join.id} href={`/`}>
                            <div className="flex mt-2 p-2 items-center cursor-pointer rounded border-[1px] border-[#e6e6e6] hover:border-teal-400 transition-all duration-300">
                                <div className='w-10 h-10 rounded-full overflow-hidden'>
                                    <img className="w-full object-cover" src={join.from_user.avatar} alt={join.from_user.name} />
                                </div>
                                <div>
                                    <h1 className="font-medium">{join.from_user.name} <span className='font-normal'>want to join your party</span></h1>
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
  );
}
