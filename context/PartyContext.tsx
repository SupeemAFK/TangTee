import React, { useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext'
import { onSnapshot, query, collection, where, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import IParty from '../interface/party'
import IMessage from '../interface/message'
import IUser from '../interface/user'
import { getUser } from '../hooks/useGetUser'

export interface IPartyContectProps {
    children: React.ReactNode
}

interface IContext {
    parties: IParty[]
    notificationsParties: IParty[]
    readNotifyParty: (unreadNotifyParty: IParty[]) => void
}

const partyContext = React.createContext({} as IContext)

export default function PartyContect ({ children }: IPartyContectProps) {
    const [parties, setParties] = useState<IParty[]>([]);
    const [notificationsParties, setNotificationsParties] = useState<IParty[]>([]);
    const { currentUser } = useAuth()

    function readNotifyParty(unreadNotifyParty: IParty[]) {
        unreadNotifyParty.map(async party => {
            await updateDoc(doc(db, "party", party.id), { isRead: true });
        })
    }

    useEffect(() => {
        if (currentUser) {
            const q = query(collection(db, "party"), where("participants", "array-contains", currentUser.id), where("author_id", "!=", currentUser.id))
            onSnapshot(q, async snapshot => {
                const allParties = await Promise.all(snapshot.docs.map(async doc => {
                    const data = doc.data();
                    const messages: IMessage[] = await Promise.all(data?.messages.map(async (messageObj: any) => {
                        const user = await getUser(messageObj.user_id)
                        return {
                          id: messageObj.id,
                          text: messageObj.text,
                          user
                        }
                      }))
                    const participants: IUser[] = await Promise.all(data?.participants.map(async (userId: string) => await getUser(userId)))
                    const author = await getUser(data?.author_id)
                    return {
                        id: doc.id,
                        messages,
                        participants,
                        author,
                        post_id: data.post_id,
                        isRead: data.isRead,
                        timestamp: data.timestamp
                    }
                }))
                const notificationsParties: IParty[] = allParties.filter(party => party.isRead === false);
                setParties(allParties);
                setNotificationsParties(notificationsParties);
            })
        }
    }, [currentUser])

    return (
        <partyContext.Provider
            value={{
                parties,
                notificationsParties,
                readNotifyParty
            }}
        >
            {children}
        </partyContext.Provider>
    );
}

export function useParty() {
    return useContext(partyContext)
}