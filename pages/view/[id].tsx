import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Tag from '../../components/Tag'
import { motion } from 'framer-motion';
import useGetPost from '../../hooks/useGetPost';
import { useAuth } from '../../context/AuthContext'
import { join, cancelJoin } from '../../utils/join'
import { isAlreadyJoined } from '../../components/Post';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '../../lib/firebase'
import Modal from '../../components/Modal'
import IUser from '../../interface/user';
import { getUser } from '../../hooks/useGetUser';

export interface IPostDetailProps {
}

export default function PostDetail (props: IPostDetailProps) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [participantsUser, setParticipantsUser] = useState<IUser[]>([])
    const [isAlreadyJoined, setIsAlreadyJoined] = useState<isAlreadyJoined>({ alreadyJoined: false, join_id: "" });
    const router = useRouter();
    const { id } = router.query;
    const { post, loading } = useGetPost(id as string);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!loading && !post) {
            router.push('/404')
        }
    }, [loading])

    useEffect(() => {
        const fetch = async () => {
            if (post) {
                const allUsers = await Promise.all(post.participants.map(async userId => await getUser(userId)))
                setParticipantsUser(allUsers)
            }
        }
        fetch()
    }, [post])

    useEffect(() => {
        if (post && currentUser) {
            const q = query(collection(db, "join"), where("post_id", "==", post.id), where("from_user_id", "==", currentUser.id));
            getDocs(q).then(snap => snap.docs.length > 0 && snap.docs.forEach(doc => setIsAlreadyJoined({ alreadyJoined: true, join_id: doc.id })))
        }
      }, [post, currentUser])

    async function handleJoin() {
        if (currentUser && post) {
            const newJoinID = await join(post, currentUser)
            newJoinID !== "" && setIsAlreadyJoined({ alreadyJoined: true, join_id: newJoinID }) 
        }
    }
 
    function handleCancel() {
        if (post && currentUser) {
            cancelJoin(post, currentUser, isAlreadyJoined.join_id)
            setIsAlreadyJoined({ alreadyJoined: false, join_id: ""})
        }
    }

    if (loading || !post) {
        return (
            <div className="mt-16 p-5 flex flex-col items-center text-teal-400">
                <div className="flex justify-center">
                    <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-teal-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                </div>
            </div>
        )
    }

    return (
        <>
            {openModal && (
                <Modal setOpenModal={setOpenModal} >
                    <div className="p-5 flex flex-col items-center">
                        <h1>Are you sure you want to <span className='font-semibold'>{isAlreadyJoined.alreadyJoined ? "Cancel" : "Join" }</span>?</h1>
                        <div className="mt-2">
                            <button onClick={() => setOpenModal(false)} className="rounded bg-red-400 text-white py-1 px-2">No</button>
                            <button 
                                onClick={() => {
                                    isAlreadyJoined.alreadyJoined ? handleCancel() : handleJoin()
                                    setOpenModal(false)
                                }} 
                                className="rounded bg-teal-400 text-white py-1 px-2 ml-2"
                            >
                                Yes
                            </button>    
                        </div>
                    </div>
                </Modal>
            )}
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { y: -100, opacity: 0 },
                    visible: { y: 0, opacity: 1, },
                }}
                className="mt-16 p-5 lg:py-10 flex flex-col items-center"
            >
                {post?.img && (
                    <div className="w-full md:w-1/2">
                        <img className="object-cover w-full" src={post.img} alt={post.title} />
                    </div>
                )}
                <div className="mt-5 w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{post.title}</h1>
                </div>
                <div className="mt-5 w-full md:w-1/2 flex items-center justify-between">
                    <div>
                        {post && post.tags.length > 0 && (
                            <div className='w-full flex justify-center mt-1'>
                                {post.tags.map(tag => (
                                    <Tag key={tag} tag={tag} />
                                ))}
                            </div>
                        )}
                    </div>
                    {(currentUser && post.user?.id !== currentUser?.id && post.status === "Open") && (
                        <>
                        {isAlreadyJoined.alreadyJoined ? (
                            <button onClick={() => setOpenModal(true)} className="bg-red-400 py-1 px-3 text-white rounded-xl ml-2">Cancel</button>
                        ) : (
                            <button onClick={() => setOpenModal(true)} className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Join</button>                        )}
                        </>
                    )}
                </div>
                <div className="w-full md:w-1/2 mt-5">
                    <p>Status : <span className={`${post.status === "Open" ? "text-green-500" : post.status === "Closed" ? "text-red-500" : "text-yellow-500"}`}>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</span></p>
                </div>
                <div className="w-full md:w-1/2 mt-5">
                    <p>{post.details}</p>
                </div>
                <div className='w-full md:w-1/2 mt-5 border-2 border-teal-400 p-2 rounded'>
                    <h1>Participants</h1>
                    <div>
                        {participantsUser.length > 0 ? participantsUser.map(user => (
                            <div className="mt-3 flex items-center" key={user.id}>
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <img className='w-full object-cover' src={user.avatar} alt={user.name} />
                                </div>
                                <p className="ml-1 text-sm flex-1">{user.name}</p>
                            </div>
                        )) : <h1 className='mt-3 text-sm'>Do not have any participants</h1>}
                    </div>
                </div>
            </motion.div>
        </>
    );
}
