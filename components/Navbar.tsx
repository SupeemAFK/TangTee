import * as React from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link'

export interface INavbarProps {
}

export default function Navbar (props: INavbarProps) {
    const { currentUser, signout } = useAuth();

    console.log(currentUser);

  return (
    <div className="py-2 px-5 h-16 bg-teal-400 flex items-center justify-between text-white">
        {currentUser?.name ? (
            <>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img className="object-cover w-full" src={currentUser.avatar} alt={currentUser.name} />
                    </div>
                    <p className="ml-2">{currentUser.name}</p> 
                </div>
                <div>
                    <button onClick={() => signout()} className="p-2 border-2 border-white text-white rounded-md">Sign out</button>
                </div>
            </>
        ) : (
            <div className="w-full flex justify-end items-center">
                <Link href="/auth">
                    <button className="p-2 border-2 border-white text-white rounded-md">Sign in</button>
                </Link>
            </div>
        )} 
    </div>
  );
}
