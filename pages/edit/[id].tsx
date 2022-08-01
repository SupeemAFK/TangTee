import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import IPost from '../../interface/post';
import getUser from '../../utils/getUser';
import { db } from '../../lib/firebase';
import { getDoc, doc, DocumentData, DocumentSnapshot } from "firebase/firestore"; 
import Tag from '../../components/Tag'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface IEditProps {
}

export default function Edit (props: IEditProps) {
    const [post, setPost] = useState<IPost | null>(null);
    const router = useRouter();
    const { id } = router.query
    const { currentUser } = useAuth();

    useEffect(() => {
        if (id) {
            getDoc(doc(db, "posts", id as string))
            .then(async docSnap => {
                const data: DocumentData | undefined = docSnap.data();
                if (data) {
                    const id: string = docSnap.id;
                    const user = await getUser(data?.user_id);
                    setPost({
                        id,
                        title: data?.title,
                        details: data?.details,
                        img: data?.img,
                        user,
                        max_participants: data?.max_participants,
                        tags: data?.tags,
                        isOpen: data?.isOpen,
                        participants: data?.participants,
                        createdAt: new Date(data?.createdAt * 1000)
                    })
                }
            })
        }
    }, [id])

    if (post == null) {
        return (
            <>
                <div className="mt-16 p-5 flex flex-col items-center text-teal-400">
                    <div className="mt-5 w-fullflex justify-center">
                        <h1 className="text-3xl font-medium">Post cannot be found</h1>
                    </div>
                    <div className="mt-5">
                        <Link href="/">
                            <button className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Go back</button>
                        </Link>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { y: -100, opacity: 0 },
                    visible: { y: 0, opacity: 1, },
                }}
                className="mt-16 p-5 flex flex-col items-center"
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
                    <button className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Join</button>
                </div>
                <div className="w-full md:w-1/2 mt-5">
                    <p>Status : <span className={`${post.isOpen ? "text-green-500" : "text-red-500"}`}>{post.isOpen ? "Open" : "Closed"}</span></p>
                </div>
                <div className="w-full md:w-1/2 mt-5">
                    <p>{post.details}</p>
                </div>
            </motion.div>
        </>
    );
}
