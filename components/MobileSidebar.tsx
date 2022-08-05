import React, { useState } from 'react';
import IJoin from '../interface/join'
import IUser from '../interface/user';
import { BsBellFill } from 'react-icons/bs'
import { HiDocumentAdd } from 'react-icons/hi'
import Link from 'next/link';
import MobileNotify from './MobileNotify'

export interface IMobileSidebarProps {
    openSidebar: boolean
    setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
    currentUser: IUser | null
    signout: () => void
    joins: IJoin[]
}

export default function MobileSidebar ({ openSidebar, setOpenSidebar, currentUser, signout, joins }: IMobileSidebarProps) {
  const [openMobileNotify, setOpenMobileNotify] = useState<boolean>(false);

  return (
    <div className={`bg-teal-400 p-2 fixed top-0 ${openSidebar ? "right-0" : "right-[-100%]"} h-screen mt-16 transition-all duration-300`}>
      <div className='flex flex-col items-center'>
        <Link href={`/user/${currentUser?.id}`}>
          <div onClick={() => setOpenSidebar(false)} className="w-10 h-10 rounded-full overflow-hidden">
              <img className="object-cover w-full" src={currentUser?.avatar} alt={currentUser?.name} />
          </div>
        </Link>
        <p className="ml-2">{currentUser?.name}</p> 
      </div>
      <div className="p-[0.01rem] bg-white my-3"></div>
      <div className='flex flex-col items-center'>
        {openMobileNotify && <MobileNotify joins={joins} setOpenMobileNotify={setOpenMobileNotify} />}
        <button 
          onClick={() => {
            setOpenMobileNotify(true)
            setOpenSidebar(false)
          }} 
          className="text-2xl relative"><BsBellFill /> 
          {joins?.length !== 0 && <div className="bg-red-500 text-white flex justify-center items-center absolute top-0 right-0 rounded-full w-3 h-3 p-2 text-xs">{joins?.length}</div>}
        </button>
      </div>
      <div className='flex flex-col items-center mt-3'>
        <Link href="/">
            <button onClick={() => setOpenSidebar(false)} className="text-2xl"><HiDocumentAdd /></button>
        </Link>
      </div>
      <div className='flex flex-col items-center mt-3'>
        <button 
          onClick={() => {
            signout()
            setOpenSidebar(false)
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
