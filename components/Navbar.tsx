import * as React from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link'

export interface INavbarProps {
}

export default function Navbar (props: INavbarProps) {
    const { currentUser, signout } = useAuth();

  return (
    <div className="py-2 px-5 h-16 bg-teal-400 flex items-center text-white fixed top-0 w-full z-10">
        <div className="flex items-center flex-1">
            {currentUser ? (
                <>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img className="object-cover w-full" src={currentUser.avatar} alt={currentUser.name} />
                </div>
                <p className="ml-2">{currentUser.name}</p> 
                </>
            ) : (
                <>
                <h1 className="text-white font-bold text-xl">Tang Tee</h1>
                <div className="w-6 ml-2"><img className="object-cover w-full" src="/icon.png" alt="icon"/></div>
                </>
            )}
        </div>
        <div className='flex justify-end flex-1'>
            {currentUser ? (
                <button onClick={() => signout()} className="p-2 border-2 border-white text-white rounded-md">Sign out</button>
            ) : (
                <Link href="/auth">
                    <button className="p-2 border-2 border-white text-white rounded-md">Sign in</button>
                </Link>
            )}
        </div>
    </div>
  );
}
