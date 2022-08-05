import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link'
import { BsBellFill } from 'react-icons/bs'
import { GiHamburgerMenu } from 'react-icons/gi'
import { HiDocumentAdd } from 'react-icons/hi'
import { AiOutlineHome } from 'react-icons/ai'
import MobileSidebar from './MobileSidebar'
import Notify from './Notify'
import { onSnapshot, collection, DocumentSnapshot } from 'firebase/firestore'
import IJoin from '../interface/join'
import IUser from '../interface/user'
import IPost from '../interface/post'
import { db } from '../lib/firebase'
import { getUser } from '../hooks/useGetUser'
import { getPost } from '../hooks/useGetPost'

export interface INavbarProps {
}

export default function Navbar (props: INavbarProps) {
    const { currentUser, signout } = useAuth();
    const [openSidebar, setOpenSidebar] = useState<boolean>(false);
    const [openNotify, setOpenNotify] = useState<boolean>(false);
    const [joins, setJoins] = useState<IJoin[]>([]);

    useEffect(() => {
        onSnapshot(collection(db, "join"), async (snapshot) => {
            const filterJoins: DocumentSnapshot[] = snapshot.docs.filter(doc => {
                const data = doc.data();
                return data.to_user_id === currentUser?.id;
            })

            const joins: IJoin[] = await Promise.all(filterJoins.map(async doc =>  {
                const data = doc.data()
                const fromUser: IUser = await getUser(data?.from_user_id)
                const post: IPost = await getPost(data?.post_id)

                return {
                    id: doc.id,
                    isRead: data?.isRead,
                    from_user: fromUser,
                    post
                }     
            }))
            setJoins(joins);
        })
    }, [currentUser])

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
            <div className='flex justify-end flex-1'>
                {currentUser ? (
                    <div className="hidden md:flex items-center"> 
                        <Link href="/">
                            <button className="mr-5 text-2xl"><HiDocumentAdd /></button>
                        </Link>
                        <button onClick={() => setOpenNotify(!openNotify)} id="notify-btn" className="mr-5 text-2xl relative p-1"><BsBellFill /> {joins?.length !== 0 && <div className="bg-red-500 text-white flex justify-center items-center absolute top-0 right-0 rounded-full w-3 h-3 p-2 text-xs">{joins?.length}</div>}</button>
                        <button onClick={() => signout()} className="p-2 border-2 border-white text-white rounded-md">Sign out</button>
                        {openNotify && (
                            <Notify joins={joins} />
                        )}
                    </div>
                ) : (
                    <Link href="/auth">
                        <button className="p-2 border-2 border-white text-white rounded-md">Sign in</button>
                    </Link>
                )}
            </div>
            {currentUser && (
                <div className="flex items-center md:hidden">
                    <button onClick={() => setOpenSidebar(!openSidebar)} className='text-2xl'><GiHamburgerMenu /></button>
                </div>
            )}
            <MobileSidebar 
                openSidebar={openSidebar} 
                setOpenSidebar={setOpenSidebar} 
                signout={signout} 
                currentUser={currentUser} 
                joins={joins}
            />
        </div>
    );
}
