import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import IPost from '../../interface/post';
import { db } from '../../lib/firebase';
import { getDoc, doc, DocumentData } from "firebase/firestore"; 
import Navbar from '../../components/Navbar'
import { motion } from 'framer-motion';

export interface IPostDetailProps {
}

export default function PostDetail (props: IPostDetailProps) {
    const [post, setPost] = useState<IPost>();
    const router = useRouter();
    const { id } = router.query
    
    useEffect(() => {
        if (id) {
            getDoc(doc(db, "posts", id as string))
            .then(docSnap => {
                const data: DocumentData | undefined = docSnap.data();
                const id: string = docSnap.id;
                setPost({
                    id,
                    title: data?.title,
                    details: data?.details,
                    img: data?.img,
                    max_participants: data?.max_participants,
                    tags: data?.tags,
                    status: data?.status,
                    requests: data?.requests,
                    accepts: data?.accepts,
                    createdAt: new Date(data?.createdAt * 1000)
                })
            })
        }
    }, [id])

    return (
        <>
            <Navbar />
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
                        <img className="object-cover w-full" src={post?.img} alt={post?.title} />
                    </div>
                )}
                <div className="mt-5 w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{post?.title}</h1>
                </div>
                <div className="mt-5 w-full md:w-1/2 flex items-center justify-between">
                    <div>
                        {post && post.tags.length > 0 && (
                            <div className='w-full flex justify-center mt-1'>
                                {post.tags.map(tag => (
                                    <div key={tag} className="bg-slate-400 mr-1 rounded-xl p-1 flex items-center justify-center text-white text-sm">
                                        <p>{tag}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="bg-teal-400 py-1 px-5 text-white rounded-xl ml-2">Join</button>
                </div>
                <div className="w-full md:w-1/2 mt-5">
                    <p>Status : <span className={`${post?.status ? "text-green-500" : "text-red-500"}`}>{post?.status ? "Open" : "Closed"}</span></p>
                </div>
                <div className="w-full md:w-1/2 mt-5">
                    <p>{post?.details}</p>
                </div>
            </motion.div>
        </>
    );
}
