import React, { useState, useEffect } from 'react';
import IPost from '../interface/post';
import IUser from '../interface/user';
import { getDoc, doc, DocumentSnapshot, DocumentData } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface IUseGetPost {
    loading: boolean;
    post: IPost | null;
}

export default function useGetPost(id: string): IUseGetPost {
    const [post, setPost] = useState<IPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            const fetch = async () => {
                setLoading(true);
                const post: IPost = await getPost(id);
                post?.title && setPost(post);
                setLoading(false);
            }
            fetch()
        }
    }, [id])

    return {
        loading,
        post
    }
}

export async function getPost(id: string): Promise<IPost> {
    const docSnap: DocumentSnapshot = await getDoc(doc(db, "posts", id));
    const data: DocumentData | undefined = docSnap.data();

    const userSnap: DocumentSnapshot | undefined = data && await getDoc(doc(db, "users", data?.user_id));
    const userData: DocumentData | undefined = userSnap?.data();
    const user: IUser | undefined = (userSnap && userData) && ({
        id: userSnap?.id,
        name: userData?.name,
        avatar: userData?.avatar,
        bio: userData?.bio,
        stars: userData?.stars,
        status: userData?.status,
    });

    return {
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
    }
}