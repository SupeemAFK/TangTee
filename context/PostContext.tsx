import React, { useContext, useState, useEffect } from 'react';
import IPost from '../interface/post'
import { collection, getDocs, query, limit, orderBy, startAfter,QuerySnapshot, DocumentData, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getUser } from '../hooks/useGetUser'

export interface IPostContextProps {
    children: React.ReactNode
}

interface IContext {
    posts: IPost[] | []
    setPosts: React.Dispatch<React.SetStateAction<[] | IPost[]>>
    fetchMore: () => void
    hasMore: boolean
}

interface IParticipantsNumber {
    post_id: string
    participants: string[]
}

const postContext = React.createContext({} as IContext)

export default function PostContext ({ children }: IPostContextProps) {
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [previousDoc, setPreviousDoc] = useState<QuerySnapshot<DocumentData>>();
    const [posts, setPosts] = useState<IPost[] | []>([]);

    function fetchMore() {
        if (previousDoc) {
            const lastVisible = previousDoc.docs[previousDoc.docs.length-1];
            const next = query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(8));
            getDocs(next)
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
                        status: data?.status,
                        participants: data?.participants,
                        createdAt: new Date(data?.createdAt * 1000)
                    }
                }))

                docSnap.docs.length < 8 ? setHasMore(false) : setHasMore(true)
                setPreviousDoc(docSnap)
                setPosts([...posts, ...dbPosts])
             })
        }
    }

    useEffect(() => {
        onSnapshot(collection(db, "posts"), snapshot => {
            const participants: IParticipantsNumber[] = snapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    post_id: doc.id,
                    participants: data.participants
                }
            })
            if (posts.length > 0) {
                const updatePosts = posts.map(post => {
                    const participantNumber = participants.find(participant => participant.post_id === post.id)
                    return {...post, participants: participantNumber?.participants} as IPost
                })
                setPosts(updatePosts)
            }
        })
    }, [posts])

    useEffect(() => {
        getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(8)))
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
                        status: data?.status,
                        participants: data?.participants,
                        createdAt: new Date(data?.createdAt * 1000)
                    }
                }))

                setPreviousDoc(docSnap)
                setPosts(dbPosts)
            })
    }, [])

  return (
    <postContext.Provider
        value={{
            posts,
            setPosts,
            fetchMore,
            hasMore
        } as IContext}
    >
      {children}
    </postContext.Provider>
  );
}

export function usePostsContext() {
    return useContext(postContext)
}