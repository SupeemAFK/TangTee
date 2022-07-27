import IUser from '../interface/user'
import { getDoc, DocumentData, DocumentSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase'

export default async function getUser(id: string): Promise<IUser> {
    const docSnap: DocumentSnapshot = await getDoc(doc(db, "users", id));
    const user: DocumentData | undefined = docSnap.data()
    return {
      id: docSnap.id,
      name: user?.name,
      avatar: user?.avatar,
      bio: user?.avatar,
      stars: user?.stars,
      status: user?.status,
    }
}