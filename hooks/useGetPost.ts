import { useState, useEffect } from 'react';
import IPost from '../interface/post';
import IUser from '../interface/user';
import { getDoc, doc, DocumentSnapshot, DocumentData, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface IUseGetPost {
    loading: boolean;
    post: IPost | null;
}

export default function useGetPost(id: string): IUseGetPost {
    const [post, setPost] = useState<IPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        id && onSnapshot(doc(db, "posts", id), async snapshot => {
            const data = snapshot.data();

            const userSnap: DocumentSnapshot | undefined = data && await getDoc(doc(db, "users", data?.user_id));
            const userData: DocumentData | undefined = userSnap?.data();
            const user: IUser | undefined = (userSnap && userData) && ({
                id: userSnap?.id,
                name: userData?.name,
                avatar: userData?.avatar,
                bio: userData?.bio,
                stars: userData?.stars,
                banner_hex: userData?.banner_hex
            });
            
            if (data) {
                setPost({
                    id,
                    title: data?.title,
                    details: data?.details,
                    img: data?.img,
                    user,
                    max_participants: data?.max_participants,
                    tags: data?.tags,
                    status: data?.status,
                    participants: data?.participants,
                    createdAt: new Date(data?.createdAt * 1000)
                })
            }
            setLoading(false);
        })
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
        banner_hex: userData?.banner_hex
    });

    return {
        id,
        title: data?.title,
        details: data?.details,
        img: data?.img,
        user,
        max_participants: data?.max_participants,
        tags: data?.tags,
        status: data?.status,
        participants: data?.participants,
        createdAt: new Date(data?.createdAt * 1000)
    }
}