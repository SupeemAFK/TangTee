import React, { useState, useEffect } from 'react';
import IUser from '../../interface/user';
import getUser from '../../utils/getUser';
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion';
import { BsFillStarFill } from 'react-icons/bs'
import { useRouter } from 'next/router';
import Link from 'next/link';

export interface IProfileProps {
}

export default function Profile (props: IProfileProps) {
    const [user, setUser] = useState<IUser | null>(null);
    const { currentUser } = useAuth();
    const router = useRouter();
    const { id } = router.query

    useEffect(() => {
        if (id) {
            getUser(id as string)
            .then(user => user.name && setUser(user))
        }
    }, [id])

    if (!user) {
        return (
            <div className="mt-16 p-5 flex flex-col items-center text-teal-400">
                    <div className="mt-5 w-fullflex justify-center">
                        <h1 className="text-3xl font-medium">User cannot be found</h1>
                    </div>
                    <div className="mt-5">
                        <Link href="/">
                            <button className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Go back</button>
                        </Link>
                    </div>
                </div>
        )
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { y: -100, opacity: 0 },
                visible: { y: 0, opacity: 1, },
            }}
            className="min-w-screen min-h-screen mt-16 flex justify-center"
        >
            <div className="w-full lg:w-1/2 flex flex-col items-center">
                <div className="bg-teal-700 w-full h-44 flex flex-col justify-end">
                    <div className="w-full flex justify-start relative mb-12">
                        <div className="ml-5 w-28 h-28 rounded-full overflow-hidden absolute top-0 border-4 border-white">
                            <img className="w-full object-cover" src={user.avatar} alt="profile" />
                        </div>
                    </div>
                </div>
                <div className="border-[1px] border-[#e6e6e6] w-full">
                    {user.id === currentUser?.id && (
                        <div className="mt-5 mr-5 flex justify-end">
                            <button className="bg-teal-400 py-1 px-5 text-white rounded-xl">Edit</button>
                        </div>
                    )}
                    <div className="my-7 ml-5">
                        <p className="font-bold text-lg">{user.name}</p>
                        <p>{user.bio}</p>
                        <div className="flex mt-3">
                            {Array.from(Array(user.stars).keys()).map(star => <BsFillStarFill key={star} />)}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
