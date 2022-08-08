import * as React from 'react';
import { motion } from 'framer-motion';
import IJoin from '../interface/join'
import Link from 'next/link'
import { IoIosArrowRoundBack } from 'react-icons/io'

export interface IMobileNotifyProps {
    joins: IJoin[]
    setOpenMobileNotify: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MobileNotify ({ joins, setOpenMobileNotify }: IMobileNotifyProps) {
  return (
    <motion.div
        initial={{ x: 100, opacity: 0}}
        animate={{ x: 0, opacity: 1 }}
        className="border-[1px] border-[#e6e6e6] bg-white text-black top-0 fixed mt-16 right-1 z-20 min-w-screen min-h-screen"
    >
        <div className="p-2">
            <div className="flex text-xl">
                <button onClick={() => setOpenMobileNotify(false)}><IoIosArrowRoundBack /></button>
                <h1 className="ml-2">Notifications</h1>
            </div>
            <div className="p-[0.01rem] bg-[#e6e6e6] my-2"></div> 
            {joins.length > 0 ? (
                <div>
                    {joins.map(join => (
                        <Link key={join.id} href={`/manage/${join.post.id}`}>
                            <div onClick={() => setOpenMobileNotify(false)} className="flex mt-2 p-2 items-center cursor-pointer rounded border-[1px] border-[#e6e6e6] hover:border-teal-400 transition-all duration-300">
                                <div className='w-10 h-10 rounded-full overflow-hidden'>
                                    <img className="w-full object-cover" src={join.from_user.avatar} alt={join.from_user.name} />
                                </div>
                                <div>
                                    <h1 className="font-medium ml-2">{join.from_user.name} <span className='font-normal'>want to join your party</span></h1>
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
