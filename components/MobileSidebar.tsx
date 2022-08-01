import * as React from 'react';
import IUser from '../interface/user';
import { BsBellFill } from 'react-icons/bs'
import { HiDocumentAdd } from 'react-icons/hi'
import Link from 'next/link';

export interface IMobileSidebarProps {
    openSidebar: boolean
    setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
    currentUser: IUser | null
    signout: () => void
}

export default function MobileSidebar ({ openSidebar, setOpenSidebar, currentUser, signout }: IMobileSidebarProps) {
  return (
    <div className={`bg-teal-400 p-2 fixed top-0 ${openSidebar ? "right-0" : "right-[-100%]"} h-screen mt-16 transition-all duration-300`}>
      <div className='flex flex-col items-center'>
        <Link href={`/user/${currentUser?.id}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden">
              <img className="object-cover w-full" src={currentUser?.avatar} alt={currentUser?.name} />
          </div>
        </Link>
        <p className="ml-2">{currentUser?.name}</p> 
      </div>
      <div className="p-[0.01rem] bg-white my-3"></div>
      <div className='flex flex-col items-center'>
        <button className="text-2xl"><BsBellFill /></button>
      </div>
      <div className='flex flex-col items-center mt-3'>
        <Link href="/">
            <button className="text-2xl"><HiDocumentAdd /></button>
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
