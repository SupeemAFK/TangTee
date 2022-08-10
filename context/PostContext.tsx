import React, { useContext, useState, useEffect } from 'react';
import IPost from '../interface/post'
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getUser } from '../hooks/useGetUser'

export interface IPostContextProps {
    children: React.ReactNode
}

interface IContext {
    posts: IPost[] | []
    setPosts: React.Dispatch<React.SetStateAction<[] | IPost[]>>
}

const postContext = React.createContext({} as IContext)

export default function PostContext ({ children }: IPostContextProps) {
    const [posts, setPosts] = useState<IPost[] | []>([]);

    useEffect(() => {
        getDocs(query(collection(db, "posts"), orderBy("createdAt"), limit(8)))
            .then(async docSnap => {
                const dbPosts: IPost[] = await Promise.all(docSnap.docs.map(async doc => {
                    const id = doc.id;
                    const data = doc.data();
                    const user = await getUser(data.user_id);
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
                }))

                setPosts(dbPosts)
            })
    }, [])

  return (
    <postContext.Provider
        value={{
            posts,
            setPosts
        } as IContext}
    >
      {children}
    </postContext.Provider>
  );
}

export function usePostsContext() {
    return useContext(postContext)
}