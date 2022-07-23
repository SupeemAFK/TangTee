import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import IPost from '../../interface/post';
import { db } from '../../lib/firebase';
import { getDoc, doc, DocumentData } from "firebase/firestore"; 

export interface IPostDetailProps {
}

export default function PostDetail (props: IPostDetailProps) {
    const [post, setPost] = useState<IPost>();
    const router = useRouter();
    const { id } = router.query
    
    useEffect(() => {
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
                    accepts: data?.accepts
                })
            })
    }, [])
    
    return (
        <div>
            <p>{post?.details}</p>
            <img src={post?.img} alt={post?.title} />
        </div>
    );
}
