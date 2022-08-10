import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Post from '../components/Post'
import IPost from '../interface/post';
import { getDocs, query, collection, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase'
import { getUser } from '../hooks/useGetUser'

export interface ISearchProps {
}

export default function Search (props: ISearchProps) {
    const [searchPosts, setSearchPosts] = useState<IPost[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (router.query?.searchText) {
            const q = query(collection(db, "posts"), 
                where("title", ">=", router.query.searchText), 
                where("title", "<=", router.query.searchText + '\uf8ff'),
                where("isOpen", "==", true),
            )
            getDocs(q)
            .then(async snapshot => {
                const posts = await Promise.all(snapshot.docs.map(async doc => {
                    const data = doc.data()
                    const user = await getUser(data.user_id)
                    return {
                        id: doc.id,
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
                }))
                setSearchPosts(posts)
            })
        }
    }, [router])

    return (
        <div>
            {searchPosts.map(searchPost => <Post key={searchPost.id} post={searchPost} />)}
        </div>
    );
}
