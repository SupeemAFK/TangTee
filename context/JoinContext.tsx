import React, { useContext, useEffect, useState } from "react"
import { onSnapshot, collection, DocumentSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase' 
import IUser from '../interface/user'
import IJoin from '../interface/join'
import IPost from '../interface/post'
import { getPost } from '../hooks/useGetPost'
import { getUser } from "../hooks/useGetUser"
import { useAuth } from './AuthContext'

export interface IJoinProps {
    children: React.ReactNode
}

interface IContext {
    joins: IJoin[],
    setJoins: React.Dispatch<React.SetStateAction<IJoin[]>>
}

const joinContext = React.createContext({} as IContext);

export default function Join ({ children }: IJoinProps) {
    const [joins, setJoins] = useState<IJoin[]>([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        onSnapshot(collection(db, "join"), async (snapshot) => {
            const filterJoins: DocumentSnapshot[] = snapshot.docs.filter(doc => {
                const data = doc.data();
                return data.to_user_id === currentUser?.id;
            })

            const joins: IJoin[] = await Promise.all(filterJoins.map(async doc =>  {
                const data = doc.data()
                const fromUser: IUser = await getUser(data?.from_user_id)
                const post: IPost = await getPost(data?.post_id)

                return {
                    id: doc.id,
                    isRead: data?.isRead,
                    from_user: fromUser,
                    post
                }     
            }))
            setJoins(joins);
        })
    }, [currentUser])

  return (
    <joinContext.Provider
        value={{
            joins,
            setJoins
        } as IContext}
    >
        {children}
    </joinContext.Provider>
  );
}

export function useJoin() {
    return useContext(joinContext);
}