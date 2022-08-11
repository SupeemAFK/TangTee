import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link'
import { BsBellFill } from 'react-icons/bs'
import { GiHamburgerMenu } from 'react-icons/gi'
import { HiDocumentAdd } from 'react-icons/hi'
import { AiOutlineHome } from 'react-icons/ai'
import MobileSidebar from './MobileSidebar'
import Notify from './Notify'
import { useJoin } from '../context/JoinContext';
import { useRouter } from 'next/router'

export interface INavbarProps {
}

export default function Navbar (props: INavbarProps) {
    const { currentUser, signout } = useAuth();
    const [searchText, setSearchText] = useState<string>("");
    const [openSidebar, setOpenSidebar] = useState<boolean>(false);
    const [openNotify, setOpenNotify] = useState<boolean>(false);
    const { joins, notificationsJoins, readNotify } = useJoin();
    const router = useRouter();

    function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSearchText("");
        router.push(`/search?searchText=${searchText}`);
    }

    return (
        <div className="py-2 px-5 h-16 bg-teal-400 flex items-center text-white fixed top-0 w-full z-20">
            <div className="flex items-center flex-1">
                {currentUser ? (
                    <>
                    <div className="flex items-center">
                        <Link href="/">
                            <button onClick={() => setOpenSidebar(false)}className="mr-5 text-2xl"><AiOutlineHome /></button>
                        </Link>
                    </div>
                    <Link href={`/user/${currentUser.id}`}>
                        <div className="hidden md:block w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                            <img className="object-cover w-full" src={currentUser.avatar} alt={currentUser.name} />
                        </div>
                    </Link> 
                    <p className="hidden md:block ml-2">{currentUser.name}</p> 
                    </>
                ) : (
                    <Link href="/">
                        <div className="flex cursor-pointer">
                            <h1 className="text-white font-bold text-xl">Tang Tee</h1>
                            <div className="w-6 ml-2"><img className="object-cover w-full" src="/icon.png" alt="icon"/></div>
                        </div>
                    </Link>
                )}
            </div>
            {currentUser && (
                <div className="lg:flex-1">
                    <form onSubmit={handleSearchSubmit}>
                        <input onChange={(e) => setSearchText(e.target.value)} value={searchText} placeholder='Search' type="text" className="p-1 w-full border-[1px] border-[#e6e6e6] rounded-sm focus:border-teal-400 outline-none transition-all duration-200 text-black" />
                    </form>
                </div>
            )}
            <div className='flex justify-end flex-1'>
                {currentUser ? (
                    <div className="hidden md:flex items-center"> 
                        <Link href="/">
                            <button className="mr-5 text-2xl"><HiDocumentAdd /></button>
                        </Link>
                        <button 
                            onClick={() => {
                                setOpenNotify(!openNotify)
                                readNotify(notificationsJoins)
                            }} 
                            id="notify-btn" 
                            className="mr-5 text-2xl relative p-1"
                        >
                            <BsBellFill /> {notificationsJoins.length > 0 && <div className="bg-red-500 text-white flex justify-center items-center absolute top-0 right-0 rounded-full w-3 h-3 p-2 text-xs">{notificationsJoins?.length}</div>}
                        </button>
                        <button onClick={() => signout()} className="p-2 border-2 border-white text-white rounded-md">Sign out</button>
                        {openNotify && (
                            <Notify joins={joins} setOpenNotify={setOpenNotify} />
                        )}
                    </div>
                ) : (
                    <Link href="/auth">
                        <button className="p-2 border-2 border-white text-white rounded-md">Sign in</button>
                    </Link>
                )}
            </div>
            {currentUser && (
                <div onClick={() => setOpenSidebar(!openSidebar)} className="flex items-center md:hidden relative cursor-pointer">
                    {notificationsJoins?.length > 0 && <div className="bg-red-500 text-white flex justify-center items-center absolute top-0 right-0 rounded-full w-3 h-3 p-2 text-xs">{notificationsJoins.length}</div>}
                    <button className='text-2xl'><GiHamburgerMenu /></button>
                </div>
            )}
            <MobileSidebar 
                openSidebar={openSidebar} 
                setOpenSidebar={setOpenSidebar} 
                signout={signout} 
                currentUser={currentUser} 
                joins={joins}
                notificationsJoins={notificationsJoins}
                readNotify={readNotify}
            />
        </div>
    );
}
