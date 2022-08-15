import React, { useState, useEffect } from 'react';
import IUser from '../interface/user'
import { getDoc, DocumentData, DocumentSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase'

export interface IUseGetUser {
  loading: boolean;
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

export default function useGetUser(id: string): IUseGetUser {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (id) {
      const fetch = async () => {
        setLoading(true);
        const user: IUser = await getUser(id);
        user?.name && setUser(user)
        setLoading(false);
      }
      fetch()
    }
  }, [id])

  return {
    loading,
    user,
    setUser
  }
}

export async function getUser(id: string): Promise<IUser> {
  const docSnap: DocumentSnapshot = await getDoc(doc(db, "users", id));
  const user: DocumentData | undefined = docSnap.data()
  return {
    id: docSnap.id,
    name: user?.name,
    avatar: user?.avatar,
    bio: user?.bio,
    stars: user?.stars,
    banner_hex: user?.banner_hex
  }
}