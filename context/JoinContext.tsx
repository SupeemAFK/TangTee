import React, { useContext, useEffect, useState } from "react"
import { onSnapshot, collection, updateDoc, doc, where, query } from 'firebase/firestore'
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
    joins: IJoin[]
    setJoins: React.Dispatch<React.SetStateAction<IJoin[]>>
    notificationsJoins: IJoin[]
    readNotifyJoin: (unreadNotify: IJoin[]) => void
}

const joinContext = React.createContext({} as IContext);

export default function Join ({ children }: IJoinProps) {
    const [joins, setJoins] = useState<IJoin[]>([]);
    const [notificationsJoins, setNotificationsJoins] = useState<IJoin[]>([]);
    const { currentUser } = useAuth();

    function readNotifyJoin(unreadNotify: IJoin[]) {
        unreadNotify.map(async join => {
            await updateDoc(doc(db, "join", join.id), { isRead: true });
        })
    }

    useEffect(() => {
        if (currentUser) {
            const q = query(collection(db, "join"), where("to_user_id", "==", currentUser.id))
            onSnapshot(q, async (snapshot) => {
                const joins: IJoin[] = await Promise.all(snapshot.docs.map(async doc =>  {
                    const data = doc.data()
                    const fromUser: IUser = await getUser(data?.from_user_id)
                    const post: IPost = await getPost(data?.post_id)
    
                    return {
                        id: doc.id,
                        isRead: data?.isRead,
                        from_user: fromUser,
                        post,
                        timestamp: data.timestamp
                    }     
                }))
                const notificationsJoins: IJoin[] = joins.filter(join => join.isRead === false);
                setJoins(joins);
                setNotificationsJoins(notificationsJoins);
            })
        }
    }, [currentUser])

  return (
    <joinContext.Provider
        value={{
            joins,
            setJoins,
            notificationsJoins,
            readNotifyJoin
        } as IContext}
    >
        {children}
    </joinContext.Provider>
  );
}

export function useJoin() {
    return useContext(joinContext);
}